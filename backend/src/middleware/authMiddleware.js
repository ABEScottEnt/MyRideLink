const { verifyToken } = require('../utils/tokenUtils');
const { AuthenticationError, AuthorizationError } = require('./errorHandler');
const { logger } = require('../config/logger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, 'access');

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(error);
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      if (!roles.includes(req.user.role)) {
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      logger.error('Role check error:', error);
      next(error);
    }
  };
};

const requireVerified = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!req.user.isVerified) {
      throw new AuthorizationError('Email verification required');
    }

    next();
  } catch (error) {
    logger.error('Verification check error:', error);
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, 'access');

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  requireRole,
  requireVerified,
  optionalAuth,
}; 