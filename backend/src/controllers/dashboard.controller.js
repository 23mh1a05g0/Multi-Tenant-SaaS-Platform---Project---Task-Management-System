const db = require('../config/db');

/**
 * GET /api/dashboard
 * Dashboard summary for tenant
 */
exports.getDashboard = async (req, res, next) => {
  const tenantId = req.user.tenant_id;
  const userId = req.user.id;

  try {
    // Total projects
    const projectCountRes = await db.query(
      'SELECT COUNT(*) FROM projects WHERE tenant_id = $1',
      [tenantId]
    );

    // Total tasks
    const taskCountRes = await db.query(
      'SELECT COUNT(*) FROM tasks WHERE tenant_id = $1',
      [tenantId]
    );

    // Completed tasks
    const completedRes = await db.query(
      "SELECT COUNT(*) FROM tasks WHERE tenant_id = $1 AND status = 'completed'",
      [tenantId]
    );

    // Pending tasks (todo + in_progress)
    const pendingRes = await db.query(
      "SELECT COUNT(*) FROM tasks WHERE tenant_id = $1 AND status != 'completed'",
      [tenantId]
    );

    // Recent projects
    const recentProjectsRes = await db.query(
      `
      SELECT p.id, p.name, p.status,
             COUNT(t.id) AS task_count
      FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE p.tenant_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 5
      `,
      [tenantId]
    );

    // My tasks
    const myTasksRes = await db.query(
      `
      SELECT t.id, t.title, t.status, t.priority,
             p.name AS project_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.assigned_to = $1
      ORDER BY t.created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    res.json({
      success: true,
      data: {
        stats: {
          projects: Number(projectCountRes.rows[0].count),
          totalTasks: Number(taskCountRes.rows[0].count),
          completed: Number(completedRes.rows[0].count),
          pending: Number(pendingRes.rows[0].count)
        },
        recentProjects: recentProjectsRes.rows.map(p => ({
          id: p.id,
          name: p.name,
          status: p.status,
          taskCount: Number(p.task_count)
        })),
        myTasks: myTasksRes.rows
      }
    });
  } catch (err) {
    next(err);
  }
};
