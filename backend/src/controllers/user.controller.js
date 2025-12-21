const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { logAudit } = require('../services/audit.service');

/**
 * API 8: Add User to Tenant
 * POST /api/tenants/:tenantId/users
 */
exports.createUser = async (req, res, next) => {
  const { tenantId } = req.params;
  const { email, password, fullName, role = 'user' } = req.body;

  try {
    // Only tenant_admin of same tenant
    if (req.user.role !== 'tenant_admin' || req.user.tenant_id !== tenantId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Check subscription limit
    const tenantRes = await db.query(
      'SELECT max_users FROM tenants WHERE id=$1',
      [tenantId]
    );

    const countRes = await db.query(
      'SELECT COUNT(*) FROM users WHERE tenant_id=$1',
      [tenantId]
    );

    if (Number(countRes.rows[0].count) >= tenantRes.rows[0].max_users) {
      return res.status(403).json({
        success: false,
        message: 'Subscription user limit reached'
      });
    }

    // Check email uniqueness per tenant
    const emailCheck = await db.query(
      'SELECT id FROM users WHERE tenant_id=$1 AND email=$2',
      [tenantId, email]
    );

    if (emailCheck.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists in this tenant'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const userRes = await db.query(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, is_active, created_at`,
      [tenantId, email, hash, fullName, role]
    );

    await logAudit({
      tenant_id: tenantId,
      user_id: req.user.id,
      action: 'CREATE_USER',
      entity_type: 'user',
      entity_id: userRes.rows[0].id,
      ip_address: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: userRes.rows[0].id,
        email: userRes.rows[0].email,
        fullName: userRes.rows[0].full_name,
        role: userRes.rows[0].role,
        tenantId,
        isActive: userRes.rows[0].is_active,
        createdAt: userRes.rows[0].created_at
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 9: List Tenant Users
 * GET /api/tenants/:tenantId/users
 */
exports.listUsers = async (req, res, next) => {
  const { tenantId } = req.params;
  const { search, role, page = 1, limit = 50 } = req.query;

  try {
    if (req.user.role !== 'super_admin' && req.user.tenant_id !== tenantId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const safeLimit = Math.min(Number(limit), 100);
    const offset = (page - 1) * safeLimit;

    let filters = ['tenant_id=$1'];
    let values = [tenantId];

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      filters.push(
        `(LOWER(full_name) LIKE $${values.length} OR LOWER(email) LIKE $${values.length})`
      );
    }

    if (role) {
      values.push(role);
      filters.push(`role=$${values.length}`);
    }

    const whereClause = `WHERE ${filters.join(' AND ')}`;

    const usersRes = await db.query(
      `
      SELECT id, email, full_name, role, is_active, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
      `,
      [...values, safeLimit, offset]
    );

    const countRes = await db.query(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      values
    );

    const total = Number(countRes.rows[0].count);
    const totalPages = Math.ceil(total / safeLimit);

    res.json({
      success: true,
      data: {
        users: usersRes.rows.map(u => ({
          id: u.id,
          email: u.email,
          fullName: u.full_name,
          role: u.role,
          isActive: u.is_active,
          createdAt: u.created_at
        })),
        total,
        pagination: {
          currentPage: Number(page),
          totalPages,
          limit: safeLimit
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 10: Update User
 * PUT /api/users/:userId
 */
exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { fullName, role, isActive } = req.body;

  try {
    const userRes = await db.query(
      'SELECT * FROM users WHERE id=$1',
      [userId]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userRes.rows[0];

    if (req.user.tenant_id !== user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Self update: only fullName
    if (req.user.id === userId) {
      if (role !== undefined || isActive !== undefined) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your name'
        });
      }
    }

    // Only tenant_admin can change role / isActive
    if ((role !== undefined || isActive !== undefined) && req.user.role !== 'tenant_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only tenant admin can update role or status'
      });
    }

    const updateRes = await db.query(
      `
      UPDATE users
      SET
        full_name = COALESCE($1, full_name),
        role = COALESCE($2, role),
        is_active = COALESCE($3, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, full_name, role, updated_at
      `,
      [fullName, role, isActive, userId]
    );

    await logAudit({
      tenant_id: user.tenant_id,
      user_id: req.user.id,
      action: 'UPDATE_USER',
      entity_type: 'user',
      entity_id: userId,
      ip_address: req.ip
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: updateRes.rows[0].id,
        fullName: updateRes.rows[0].full_name,
        role: updateRes.rows[0].role,
        updatedAt: updateRes.rows[0].updated_at
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 11: Delete User
 * DELETE /api/users/:userId
 */
exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (req.user.role !== 'tenant_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.user.id === userId) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete yourself'
      });
    }

    const userRes = await db.query(
      'SELECT tenant_id FROM users WHERE id=$1',
      [userId]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (userRes.rows[0].tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await db.query('DELETE FROM users WHERE id=$1', [userId]);

    await logAudit({
      tenant_id: req.user.tenant_id,
      user_id: req.user.id,
      action: 'DELETE_USER',
      entity_type: 'user',
      entity_id: userId,
      ip_address: req.ip
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
