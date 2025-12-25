const router = require('express').Router();
const authenticate = require('../middleware/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

router.get('/dashboard', authenticate, dashboardController.getDashboard);

module.exports = router;
