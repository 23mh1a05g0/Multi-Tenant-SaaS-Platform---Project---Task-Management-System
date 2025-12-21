const { body } = require('express-validator');

exports.createTaskValidator = [
  body('title').notEmpty(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601()
];

exports.updateTaskStatusValidator = [
  body('status').isIn(['todo', 'in_progress', 'completed'])
];

exports.updateTaskValidator = [
  body('title').optional().notEmpty(),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601().optional({ nullable: true })
];
