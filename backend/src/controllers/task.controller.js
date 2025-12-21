const db = require('../config/db');
const { logAudit } = require('../services/audit.service');

/**
 * API 16: Create Task
 * POST /api/projects/:projectId/tasks
 */
exports.createTask = async (req, res, next) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, priority = 'medium', dueDate } = req.body;

  try {
    // Verify project belongs to user's tenant
    const projectRes = await db.query(
      'SELECT tenant_id FROM projects WHERE id=$1',
      [projectId]
    );

    if (projectRes.rowCount === 0 || projectRes.rows[0].tenant_id !== req.user.tenant_id) {
      return res.status(403).json({
        success: false,
        message: 'Project does not belong to your tenant'
      });
    }

    const tenantId = projectRes.rows[0].tenant_id;

    // Validate assignedTo user
    if (assignedTo) {
      const userRes = await db.query(
        'SELECT id FROM users WHERE id=$1 AND tenant_id=$2',
        [assignedTo, tenantId]
      );

      if (userRes.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user does not belong to this tenant'
        });
      }
    }

    const taskRes = await db.query(
      `INSERT INTO tasks
       (project_id, tenant_id, title, description, status, priority, assigned_to, due_date)
       VALUES ($1, $2, $3, $4, 'todo', $5, $6, $7)
       RETURNING *`,
      [projectId, tenantId, title, description, priority, assignedTo || null, dueDate || null]
    );

    await logAudit({
      tenant_id: tenantId,
      user_id: req.user.id,
      action: 'CREATE_TASK',
      entity_type: 'task',
      entity_id: taskRes.rows[0].id,
      ip_address: req.ip
    });

    const t = taskRes.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: t.id,
        projectId: t.project_id,
        tenantId: t.tenant_id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignedTo: t.assigned_to,
        dueDate: t.due_date,
        createdAt: t.created_at
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 17: List Project Tasks
 * GET /api/projects/:projectId/tasks
 */
exports.listTasks = async (req, res, next) => {
  const { projectId } = req.params;
  const { status, assignedTo, priority, search, page = 1, limit = 50 } = req.query;

  try {
    const projectRes = await db.query(
      'SELECT tenant_id FROM projects WHERE id=$1',
      [projectId]
    );

    if (projectRes.rowCount === 0 || projectRes.rows[0].tenant_id !== req.user.tenant_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const safeLimit = Math.min(Number(limit), 100);
    const offset = (page - 1) * safeLimit;

    let filters = ['t.project_id=$1'];
    let values = [projectId];

    if (status) {
      values.push(status);
      filters.push(`t.status=$${values.length}`);
    }

    if (assignedTo) {
      values.push(assignedTo);
      filters.push(`t.assigned_to=$${values.length}`);
    }

    if (priority) {
      values.push(priority);
      filters.push(`t.priority=$${values.length}`);
    }

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      filters.push(`LOWER(t.title) LIKE $${values.length}`);
    }

    const whereClause = `WHERE ${filters.join(' AND ')}`;

    const tasksRes = await db.query(
      `
      SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.due_date, t.created_at,
        u.id AS user_id, u.full_name, u.email
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      ${whereClause}
      ORDER BY
        CASE t.priority
          WHEN 'high' THEN 3
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 1
        END DESC,
        t.due_date ASC NULLS LAST
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
      `,
      [...values, safeLimit, offset]
    );

    const countRes = await db.query(
      `SELECT COUNT(*) FROM tasks t ${whereClause}`,
      values
    );

    const total = Number(countRes.rows[0].count);
    const totalPages = Math.ceil(total / safeLimit);

    res.json({
      success: true,
      data: {
        tasks: tasksRes.rows.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          assignedTo: t.user_id
            ? { id: t.user_id, fullName: t.full_name, email: t.email }
            : null,
          dueDate: t.due_date,
          createdAt: t.created_at
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
 * API 18: Update Task Status
 * PATCH /api/tasks/:taskId/status
 */
exports.updateTaskStatus = async (req, res, next) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const taskRes = await db.query(
      'SELECT tenant_id FROM tasks WHERE id=$1',
      [taskId]
    );

    if (taskRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (taskRes.rows[0].tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updateRes = await db.query(
      `UPDATE tasks
       SET status=$1, updated_at=CURRENT_TIMESTAMP
       WHERE id=$2
       RETURNING id, status, updated_at`,
      [status, taskId]
    );

    res.json({
      success: true,
      data: updateRes.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API 19: Update Task
 * PUT /api/tasks/:taskId
 */
exports.updateTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { title, description, status, priority, assignedTo, dueDate } = req.body;

  try {
    const taskRes = await db.query(
      'SELECT tenant_id FROM tasks WHERE id=$1',
      [taskId]
    );

    if (taskRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const tenantId = taskRes.rows[0].tenant_id;

    if (tenantId !== req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (assignedTo !== undefined && assignedTo !== null) {
      const userRes = await db.query(
        'SELECT id FROM users WHERE id=$1 AND tenant_id=$2',
        [assignedTo, tenantId]
      );

      if (userRes.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user does not belong to this tenant'
        });
      }
    }

    const updateRes = await db.query(
      `
      UPDATE tasks
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        priority = COALESCE($4, priority),
        assigned_to = $5,
        due_date = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *`,
      [title, description, status, priority, assignedTo ?? null, dueDate ?? null, taskId]
    );

    await logAudit({
      tenant_id: tenantId,
      user_id: req.user.id,
      action: 'UPDATE_TASK',
      entity_type: 'task',
      entity_id: taskId,
      ip_address: req.ip
    });

    const t = updateRes.rows[0];

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: {
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignedTo: t.assigned_to,
        dueDate: t.due_date,
        updatedAt: t.updated_at
      }
    });
  } catch (err) {
    next(err);
  }
};
