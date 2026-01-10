const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');
const { STATUS_CODES, JWT_SECRET } = require('../config/constants');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return sendError(res, STATUS_CODES.UNAUTHORIZED, 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, STATUS_CODES.UNAUTHORIZED, 'Invalid token format');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return sendError(res, STATUS_CODES.FORBIDDEN, 'Invalid or expired token');
    }

    req.user = {
      id: decoded.id,
      username: decoded.username,
    };

    next();
  });
};

module.exports = authenticate;
