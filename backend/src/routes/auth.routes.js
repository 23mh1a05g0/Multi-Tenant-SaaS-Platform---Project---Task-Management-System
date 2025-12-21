const router = require('express').Router();

const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  registerTenantValidator,
  loginValidator
} = require('../validators/auth.validator');

const authController = require('../controllers/auth.controller');

router.post(
  '/register-tenant',
  registerTenantValidator,
  validate,
  authController.registerTenant
);

router.post(
  '/login',
  loginValidator,
  validate,
  authController.login
);

router.get('/me', authenticate, authController.me);

router.post('/logout', authenticate, authController.logout);

module.exports = router;
