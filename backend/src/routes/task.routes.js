const router = require('express').Router();

const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const taskController = require('../controllers/task.controller');
const {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator
} = require('../validators/task.validator');

// API 16 & 17
router.post(
  '/projects/:projectId/tasks',
  authenticate,
  createTaskValidator,
  validate,
  taskController.createTask
);

router.get(
  '/projects/:projectId/tasks',
  authenticate,
  taskController.listTasks
);

// API 18
router.patch(
  '/tasks/:taskId/status',
  authenticate,
  updateTaskStatusValidator,
  validate,
  taskController.updateTaskStatus
);

// API 19
router.put(
  '/tasks/:taskId',
  authenticate,
  updateTaskValidator,
  validate,
  taskController.updateTask
);

module.exports = router;
