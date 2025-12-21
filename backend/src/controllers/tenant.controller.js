const db = require('../config/db');
const { logAudit } = require('../services/audit.service');

/**
 * API 5: Get Tenant Details
 * GET /api/tenants/:tenantId
 */
exports.getTenantDetails = async (req, res, next) => {
  const { tenantId } = req.params;

  try {
    // Authorization: must belong to tenant OR be super_admin
    if (req.user.role !== 'super_admin' && req.user.tenant_id !== tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const tenantRes = await db.query(
      `SELECT id, name, subdomain, status, subscription_plan,
              max_users, max_projects, created_at
       FROM tenants
       WHERE id = $1`,
      [tenantId]
    );

    if (tenantRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    const statsRes = await db.query(
      `SELECT
         (SELECT COUNT(*) FROM users WHERE tenant_id = $1) AS total_users,
         (SELECT COUNT(*) FROM projects WHERE tenant_id = $1) AS total_projects,
         (SELECT COUNT(*) FROM tasks WHERE tenant_id = $1) AS total_tasks`,
      [tenantId]
    );

    const tenant = tenantRes.rows[0];
    const stats = statsRes.rows[0];

    res.json({
      success: true,
      data: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
        subscriptionPlan: tenant.subscription_plan,
        maxUsers: tenant.max_users,
        maxProjects: tenant.max_projects,
        createdAt: tenant.created_at,
        stats: {
          totalUsers: Number(stats.total_users),
          totalProjects: Number(stats.total_projects),
          totalTasks: Number(stats.total_tasks)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 6: Update Tenant
 * PUT /api/tenants/:tenantId
 */
exports.updateTenant = async (req, res, next) => {
  const { tenantId } = req.params;
  const { name, status, subscriptionPlan, maxUsers, maxProjects } = req.body;

  try {
    // Tenant admin restriction
    if (req.user.role === 'tenant_admin' && req.user.tenant_id !== tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    // Tenant admin can only update name
    if (req.user.role === 'tenant_admin') {
      if (status || subscriptionPlan || maxUsers || maxProjects) {
        return res.status(403).json({
          success: false,
          message: 'You are not allowed to update these fields'
        });
      }
    }

    const updateRes = await db.query(
      `UPDATE tenants
       SET
         name = COALESCE($1, name),
         status = COALESCE($2, status),
         subscription_plan = COALESCE($3, subscription_plan),
         max_users = COALESCE($4, max_users),
         max_projects = COALESCE($5, max_projects),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, name, updated_at`,
      [name, status, subscriptionPlan, maxUsers, maxProjects, tenantId]
    );

    if (updateRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    await logAudit({
      tenant_id: tenantId,
      user_id: req.user.id,
      action: 'UPDATE_TENANT',
      entity_type: 'tenant',
      entity_id: tenantId,
      ip_address: req.ip
    });

    res.json({
      success: true,
      message: 'Tenant updated successfully',
      data: {
        id: updateRes.rows[0].id,
        name: updateRes.rows[0].name,
        updatedAt: updateRes.rows[0].updated_at
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 7: List All Tenants
 * GET /api/tenants
 * super_admin only
 */
exports.listTenants = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 100);
  const offset = (page - 1) * limit;
  const { status, subscriptionPlan } = req.query;

  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    let filters = [];
    let values = [];

    if (status) {
      values.push(status);
      filters.push(`status = $${values.length}`);
    }

    if (subscriptionPlan) {
      values.push(subscriptionPlan);
      filters.push(`subscription_plan = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const tenantsRes = await db.query(
      `
      SELECT
        t.id, t.name, t.subdomain, t.status, t.subscription_plan,
        t.created_at,
        (SELECT COUNT(*) FROM users u WHERE u.tenant_id = t.id) AS total_users,
        (SELECT COUNT(*) FROM projects p WHERE p.tenant_id = t.id) AS total_projects
      FROM tenants t
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
      `,
      [...values, limit, offset]
    );

    const countRes = await db.query(
      `SELECT COUNT(*) FROM tenants ${whereClause}`,
      values
    );

    const totalTenants = Number(countRes.rows[0].count);
    const totalPages = Math.ceil(totalTenants / limit);

    res.json({
      success: true,
      data: {
        tenants: tenantsRes.rows.map(t => ({
          id: t.id,
          name: t.name,
          subdomain: t.subdomain,
          status: t.status,
          subscriptionPlan: t.subscription_plan,
          totalUsers: Number(t.total_users),
          totalProjects: Number(t.total_projects),
          createdAt: t.created_at
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalTenants,
          limit
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
