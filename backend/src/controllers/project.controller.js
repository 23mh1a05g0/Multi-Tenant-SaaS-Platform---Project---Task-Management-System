const db = require('../config/db');
const { logAudit } = require('../services/audit.service');

/**
 * API 12: Create Project
 * POST /api/projects
 */
exports.createProject = async (req, res, next) => {
  const { name, description, status = 'active' } = req.body;
  const tenantId = req.user.tenant_id;
  const createdBy = req.user.id;

  try {
    // Check project limit
    const tenantRes = await db.query(
      'SELECT max_projects FROM tenants WHERE id=$1',
      [tenantId]
    );

    const countRes = await db.query(
      'SELECT COUNT(*) FROM projects WHERE tenant_id=$1',
      [tenantId]
    );

    if (Number(countRes.rows[0].count) >= tenantRes.rows[0].max_projects) {
      return res.status(403).json({
        success: false,
        message: 'Project limit reached'
      });
    }

    const projectRes = await db.query(
      `INSERT INTO projects (tenant_id, name, description, status, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, tenant_id, name, description, status, created_by, created_at`,
      [tenantId, name, description, status, createdBy]
    );

    await logAudit({
      tenant_id: tenantId,
      user_id: createdBy,
      action: 'CREATE_PROJECT',
      entity_type: 'project',
      entity_id: projectRes.rows[0].id,
      ip_address: req.ip
    });

    const p = projectRes.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: p.id,
        tenantId: p.tenant_id,
        name: p.name,
        description: p.description,
        status: p.status,
        createdBy: p.created_by,
        createdAt: p.created_at
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 13: List Projects
 * GET /api/projects
 */
exports.listProjects = async (req, res, next) => {
  const tenantId = req.user.tenant_id;
  const { status, search, page = 1, limit = 20 } = req.query;

  try {
    const safeLimit = Math.min(Number(limit), 100);
    const offset = (page - 1) * safeLimit;

    let filters = ['p.tenant_id = $1'];
    let values = [tenantId];

    if (status) {
      values.push(status);
      filters.push(`p.status = $${values.length}`);
    }

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      filters.push(`LOWER(p.name) LIKE $${values.length}`);
    }

    const whereClause = `WHERE ${filters.join(' AND ')}`;

    const projectsRes = await db.query(
      `
      SELECT
        p.id, p.name, p.description, p.status, p.created_at,
        u.id AS creator_id, u.full_name AS creator_name,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS task_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status='completed') AS completed_task_count
      FROM projects p
      JOIN users u ON p.created_by = u.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
      `,
      [...values, safeLimit, offset]
    );

    const countRes = await db.query(
      `SELECT COUNT(*) FROM projects p ${whereClause}`,
      values
    );

    const total = Number(countRes.rows[0].count);
    const totalPages = Math.ceil(total / safeLimit);

    res.json({
      success: true,
      data: {
        projects: projectsRes.rows.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: p.status,
          createdBy: {
            id: p.creator_id,
            fullName: p.creator_name
          },
          taskCount: Number(p.task_count),
          completedTaskCount: Number(p.completed_task_count),
          createdAt: p.created_at
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
 * API 12.5: Get Single Project
 * GET /api/projects/:projectId
 */
exports.getProjectById = async (req, res, next) => {
  const { projectId } = req.params;
  const tenantId = req.user.tenant_id;

  try {
    const projectRes = await db.query(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.status,
        p.created_at,
        u.id AS creator_id,
        u.full_name AS creator_name
      FROM projects p
      JOIN users u ON p.created_by = u.id
      WHERE p.id = $1 AND p.tenant_id = $2
      `,
      [projectId, tenantId]
    );

    if (projectRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const p = projectRes.rows[0];

    res.json({
      success: true,
      data: {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        createdAt: p.created_at,
        createdBy: {
          id: p.creator_id,
          fullName: p.creator_name
        }
      }
    });
  } catch (err) {
    next(err);
  }
};


/**
 * API 14: Update Project
 * PUT /api/projects/:projectId
 */
exports.updateProject = async (req, res, next) => {
  const { projectId } = req.params;
  const { name, description, status } = req.body;

  try {
    const projectRes = await db.query(
      'SELECT * FROM projects WHERE id=$1',
      [projectId]
    );

    if (projectRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projectRes.rows[0];

    if (project.tenant_id !== req.user.tenant_id) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (
      req.user.role !== 'tenant_admin' &&
      project.created_by !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const updateRes = await db.query(
      `
      UPDATE projects
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, description, status, updated_at
      `,
      [name, description, status, projectId]
    );

    await logAudit({
      tenant_id: req.user.tenant_id,
      user_id: req.user.id,
      action: 'UPDATE_PROJECT',
      entity_type: 'project',
      entity_id: projectId,
      ip_address: req.ip
    });

    const p = updateRes.rows[0];

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        updatedAt: p.updated_at
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 15: Delete Project
 * DELETE /api/projects/:projectId
 */
exports.deleteProject = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const projectRes = await db.query(
      'SELECT tenant_id, created_by FROM projects WHERE id=$1',
      [projectId]
    );

    if (projectRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projectRes.rows[0];

    if (project.tenant_id !== req.user.tenant_id) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (
      req.user.role !== 'tenant_admin' &&
      project.created_by !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await db.query('DELETE FROM projects WHERE id=$1', [projectId]);

    await logAudit({
      tenant_id: req.user.tenant_id,
      user_id: req.user.id,
      action: 'DELETE_PROJECT',
      entity_type: 'project',
      entity_id: projectId,
      ip_address: req.ip
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
