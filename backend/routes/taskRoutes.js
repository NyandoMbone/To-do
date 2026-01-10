const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Task routes - all require authentication
 */

// GET /api/tasks
router.get('/', authenticate, taskController.getTasks);

// GET /api/tasks/:id
router.get('/:id', authenticate, taskController.getTaskById);

// POST /api/tasks
router.post('/', authenticate, taskController.createTask);

// PUT /api/tasks/:id
router.put('/:id', authenticate, taskController.updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', authenticate, taskController.deleteTask);

module.exports = router;
