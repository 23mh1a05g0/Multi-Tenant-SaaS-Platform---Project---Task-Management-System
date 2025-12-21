const router = require('express').Router();

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const validate = require('../middleware/validate.middleware');

const userController = require('../controllers/user.controller');
const {
  createUserValidator,
  updateUserValidator
} = require('../validators/user.validator');

// API 8 & 9
router.post(
  '/tenants/:tenantId/users',
  authenticate,
  authorize('tenant_admin'),
  createUserValidator,
  validate,
  userController.createUser
);

router.get(
  '/tenants/:tenantId/users',
  authenticate,
  userController.listUsers
);

// API 10
router.put(
  '/users/:userId',
  authenticate,
  updateUserValidator,
  validate,
  userController.updateUser
);

// API 11
router.delete(
  '/users/:userId',
  authenticate,
  authorize('tenant_admin'),
  userController.deleteUser
);

module.exports = router;
