const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logAudit } = require('../services/audit.service');

/* ================================
   API 1: REGISTER TENANT
================================ */
exports.registerTenant = async (req, res, next) => {
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;

  /* ---- VALIDATION (CRITICAL) ---- */
  if (!tenantName || !subdomain || !adminEmail || !adminPassword || !adminFullName) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  if (adminPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters'
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    /* ---- CHECK SUBDOMAIN ---- */
    const tenantCheck = await client.query(
      'SELECT id FROM tenants WHERE subdomain = $1',
      [subdomain]
    );

    if (tenantCheck.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'Subdomain already exists'
      });
    }

    /* ---- CREATE TENANT ---- */
    const tenantResult = await client.query(
      `INSERT INTO tenants
       (name, subdomain, status, subscription_plan, max_users, max_projects)
       VALUES ($1, $2, 'active', 'free', 5, 3)
       RETURNING id, subdomain`,
      [tenantName.trim(), subdomain.trim()]
    );

    const tenantId = tenantResult.rows[0].id;

    /* ---- CHECK EMAIL (PER TENANT) ---- */
    const emailCheck = await client.query(
      'SELECT id FROM users WHERE email = $1 AND tenant_id = $2',
      [adminEmail, tenantId]
    );

    if (emailCheck.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'Email already exists in this tenant'
      });
    }

    /* ---- HASH PASSWORD ---- */
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    /* ---- CREATE TENANT ADMIN ---- */
    const userResult = await client.query(
      `INSERT INTO users
       (tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, 'tenant_admin')
       RETURNING id, email, full_name, role`,
      [tenantId, adminEmail, passwordHash, adminFullName.trim()]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Tenant registered successfully',
      data: {
        tenantId,
        subdomain,
        adminUser: {
          id: userResult.rows[0].id,
          email: userResult.rows[0].email,
          fullName: userResult.rows[0].full_name,
          role: userResult.rows[0].role
        }
      }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('REGISTER TENANT ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  } finally {
    client.release();
  }
};

/* ================================
   API 2: LOGIN
================================ */
exports.login = async (req, res, next) => {
  const { email, password, tenantSubdomain } = req.body;

  if (!email || !password || !tenantSubdomain) {
    return res.status(400).json({
      success: false,
      message: 'Email, password and tenant subdomain are required'
    });
  }

  try {
    const tenantRes = await pool.query(
      'SELECT * FROM tenants WHERE subdomain = $1',
      [tenantSubdomain]
    );

    if (tenantRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    if (tenantRes.rows[0].status !== 'active') {
      return res.status(403).json({ success: false, message: 'Tenant suspended' });
    }

    const tenantId = tenantRes.rows[0].id;

    const userRes = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND tenant_id = $2 AND is_active = true',
      [email, tenantId]
    );

    if (userRes.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, tenant_id: tenantId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId
        },
        token,
        expiresIn: 86400
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ================================
   API 3: ME
================================ */
exports.me = async (req, res, next) => {
  try {
    const userRes = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.role, u.is_active,
              t.id AS tenant_id, t.name, t.subdomain,
              t.subscription_plan, t.max_users, t.max_projects
       FROM users u
       LEFT JOIN tenants t ON u.tenant_id = t.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const u = userRes.rows[0];

    res.json({
      success: true,
      data: {
        id: u.id,
        email: u.email,
        fullName: u.full_name,
        role: u.role,
        isActive: u.is_active,
        tenant: u.tenant_id ? {
          id: u.tenant_id,
          name: u.name,
          subdomain: u.subdomain,
          subscriptionPlan: u.subscription_plan,
          maxUsers: u.max_users,
          maxProjects: u.max_projects
        } : null
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ================================
   API 4: LOGOUT
================================ */
exports.logout = async (req, res) => {
  await logAudit({
    tenant_id: req.user.tenant_id,
    user_id: req.user.id,
    action: 'LOGOUT',
    entity_type: 'user',
    entity_id: req.user.id,
    ip_address: req.ip
  });

  res.json({ success: true, message: 'Logged out successfully' });
};
