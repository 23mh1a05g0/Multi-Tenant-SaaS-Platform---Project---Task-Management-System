const { body } = require('express-validator');

exports.createUserValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('fullName').notEmpty(),
  body('role').optional().isIn(['user', 'tenant_admin'])
];

exports.updateUserValidator = [
  body('fullName').optional().notEmpty(),
  body('role').optional().isIn(['user', 'tenant_admin']),
  body('isActive').optional().isBoolean()
];
