const router = require('express').Router();

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');

const tenantController = require('../controllers/tenant.controller');

// API 5: Get tenant details
router.get(
  '/:tenantId',
  authenticate,
  tenantController.getTenantDetails
);

// API 6: Update tenant
router.put(
  '/:tenantId',
  authenticate,
  authorize('tenant_admin', 'super_admin'),
  tenantController.updateTenant
);

// API 7: List all tenants (super_admin only)
router.get(
  '/',
  authenticate,
  authorize('super_admin'),
  tenantController.listTenants
);

module.exports = router;
