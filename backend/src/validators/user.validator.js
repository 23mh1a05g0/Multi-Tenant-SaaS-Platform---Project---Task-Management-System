const { body } = require('express-validator');

exports.createUserValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty(),
  body('role').isIn(['tenant_admin', 'user'])
];
