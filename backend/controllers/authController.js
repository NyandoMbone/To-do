const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { STATUS_CODES, JWT_SECRET, JWT_EXPIRY } = require('../config/constants');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Username and password required');
  }

  if (password.length < 6) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Password must be at least 6 characters');
  }

  // Check if user exists
  db.query('SELECT id FROM users WHERE username = ?', [username], (checkErr, checkResults) => {
    if (checkErr) {
      return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Database error', checkErr);
    }

    if (checkResults.length > 0) {
      return sendError(res, STATUS_CODES.CONFLICT, 'Username already exists');
    }

    // Hash password
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Error hashing password', hashErr);
      }

      // Insert user
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (insertErr, result) => {
        if (insertErr) {
          return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Error creating user', insertErr);
        }

        sendSuccess(res, STATUS_CODES.CREATED, 'User registered successfully', {
          id: result.insertId,
          username,
        });
      });
    });
  });
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Username and password required');
  }

  // Find user
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Database error', err);
    }

    if (results.length === 0) {
      return sendError(res, STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');
    }

    const user = results[0];

    // Compare password
    bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
      if (bcryptErr) {
        return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Authentication error', bcryptErr);
      }

      if (!isMatch) {
        return sendError(res, STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');
      }

      // Create JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      sendSuccess(res, STATUS_CODES.OK, 'Login successful', {
        token,
        user: { id: user.id, username: user.username },
      });
    });
  });
};

/**
 * Get current user info
 * GET /api/auth/me
 */
const getMe = (req, res) => {
  sendSuccess(res, STATUS_CODES.OK, 'User info retrieved', {
    id: req.user.id,
    username: req.user.username,
  });
};

/**
 * Change password for current user
 * POST /api/auth/change-password
 */
const changePassword = (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Current and new passwords are required');
  }

  if (newPassword.length < 6) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'New password must be at least 6 characters');
  }

  // Fetch user
  db.query('SELECT password FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Database error', err);
    if (results.length === 0) return sendError(res, STATUS_CODES.NOT_FOUND, 'User not found');

    const hashed = results[0].password;
    // Compare current password
    bcrypt.compare(currentPassword, hashed, (cmpErr, isMatch) => {
      if (cmpErr) return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Error verifying password', cmpErr);
      if (!isMatch) return sendError(res, STATUS_CODES.FORBIDDEN, 'Current password is incorrect');

      // Hash new password and update
      bcrypt.hash(newPassword, 10, (hashErr, newHashed) => {
        if (hashErr) return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Error hashing password', hashErr);

        db.query('UPDATE users SET password = ? WHERE id = ?', [newHashed, userId], (updateErr) => {
          if (updateErr) return sendError(res, STATUS_CODES.INTERNAL_ERROR, 'Failed to update password', updateErr);
          sendSuccess(res, STATUS_CODES.OK, 'Password changed successfully');
        });
      });
    });
  });
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
};
