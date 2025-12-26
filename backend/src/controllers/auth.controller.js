const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logAudit } = require('../services/audit.service');

/**
 * API 1: Register Tenant
 * POST /api/auth/register-tenant
 */
exports.registerTenant = async (req, res, next) => {
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;

  try {
    await db.query('BEGIN');

    // Check subdomain uniqueness
    const tenantCheck = await db.query(
      'SELECT id FROM tenants WHERE subdomain=$1',
      [subdomain]
    );

    if (tenantCheck.rowCount > 0) {
      await db.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'Subdomain already exists'
      });
    }

    // Create tenant
    const tenantRes = await db.query(
      `INSERT INTO tenants (name, subdomain, status, subscription_plan, max_users, max_projects)
       VALUES ($1, $2, 'active', 'free', 5, 3)
       RETURNING id, subdomain`,
      [tenantName, subdomain]
    );

    const tenantId = tenantRes.rows[0].id;

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create tenant admin
    const userRes = await db.query(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, 'tenant_admin')
       RETURNING id, email, full_name, role`,
      [tenantId, adminEmail, passwordHash, adminFullName]
    );

    await db.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Tenant registered successfully',
      data: {
        tenantId,
        subdomain,
        adminUser: {
          id: userRes.rows[0].id,
          email: userRes.rows[0].email,
          fullName: userRes.rows[0].full_name,
          role: userRes.rows[0].role
        }
      }
    });
  } catch (err) {
    await db.query('ROLLBACK');
    next(err);
  }
};

/**
 * API 2: Login
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  const { email, password, tenantSubdomain } = req.body;

  try {
    /* ================= SUPER ADMIN LOGIN ================= */
    const superAdminRes = await db.query(
      'SELECT * FROM users WHERE email=$1 AND role=$2 AND is_active=true',
      [email, 'super_admin']
    );

    if (superAdminRes.rowCount > 0) {
      const superAdmin = superAdminRes.rows[0];

      const match = await bcrypt.compare(password, superAdmin.password_hash);
      if (!match) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const token = jwt.sign(
        { id: superAdmin.id, role: superAdmin.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        data: {
          user: {
            id: superAdmin.id,
            email: superAdmin.email,
            fullName: superAdmin.full_name,
            role: superAdmin.role
          },
          token,
          expiresIn: 86400
        }
      });
    }

    /* ================= TENANT LOGIN (EXISTING LOGIC) ================= */

    if (!tenantSubdomain) {
      return res.status(400).json({
        success: false,
        message: 'Tenant subdomain is required'
      });
    }

    const tenantRes = await db.query(
      'SELECT * FROM tenants WHERE subdomain=$1',
      [tenantSubdomain]
    );

    if (tenantRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    if (tenantRes.rows[0].status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Tenant suspended'
      });
    }

    const tenantId = tenantRes.rows[0].id;

    const userRes = await db.query(
      'SELECT * FROM users WHERE email=$1 AND tenant_id=$2 AND is_active=true',
      [email, tenantId]
    );

    if (userRes.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
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

/**
 * API 3: Get Current User
 * GET /api/auth/me
 */
exports.me = async (req, res, next) => {
  try {
    const userRes = await db.query(
      `SELECT u.id, u.email, u.full_name, u.role, u.is_active,
              t.id AS tenant_id, t.name, t.subdomain, t.subscription_plan, t.max_users, t.max_projects
       FROM users u
       LEFT JOIN tenants t ON u.tenant_id = t.id
       WHERE u.id=$1`,
      [req.user.id]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
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
        tenant: u.tenant_id
          ? {
              id: u.tenant_id,
              name: u.name,
              subdomain: u.subdomain,
              subscriptionPlan: u.subscription_plan,
              maxUsers: u.max_users,
              maxProjects: u.max_projects
            }
          : null
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 4: Logout
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  await logAudit({
    tenant_id: req.user.tenant_id || null,
    user_id: req.user.id,
    action: 'LOGOUT',
    entity_type: 'user',
    entity_id: req.user.id,
    ip_address: req.ip
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
