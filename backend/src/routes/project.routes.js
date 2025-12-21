const router = require('express').Router();

const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const projectController = require('../controllers/project.controller');
const {
  createProjectValidator,
  updateProjectValidator
} = require('../validators/project.validator');

// API 12 & 13
router.post(
  '/projects',
  authenticate,
  createProjectValidator,
  validate,
  projectController.createProject
);

router.get(
  '/projects',
  authenticate,
  projectController.listProjects
);

// API 14
router.put(
  '/projects/:projectId',
  authenticate,
  updateProjectValidator,
  validate,
  projectController.updateProject
);

// API 15
router.delete(
  '/projects/:projectId',
  authenticate,
  projectController.deleteProject
);

module.exports = router;
