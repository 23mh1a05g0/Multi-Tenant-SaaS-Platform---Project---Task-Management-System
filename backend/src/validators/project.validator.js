const { body } = require('express-validator');

exports.createProjectValidator = [
  body('name').notEmpty(),
  body('description').optional(),
  body('status').optional().isIn(['active', 'archived', 'completed'])
];

exports.updateProjectValidator = [
  body('name').optional().notEmpty(),
  body('description').optional(),
  body('status').optional().isIn(['active', 'archived', 'completed'])
];
