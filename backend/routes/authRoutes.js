const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Authentication routes
 */

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe);

// POST /api/auth/change-password
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;