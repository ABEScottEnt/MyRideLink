const Joi = require('joi');
const { ValidationError } = require('./errorHandler');
const { validationResult } = require('express-validator');
const winston = require('winston');
const { logger } = require('../config/logger');

/**
 * Validate request body against Joi schema
 * @param {Object} schema - Joi validation schema
 */
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new ValidationError(message));
    }

    next();
  };
}

/**
 * Validate request parameters against Joi schema
 * @param {Object} schema - Joi validation schema
 */
exports.validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new ValidationError(message));
    }

    next();
  };
};

/**
 * Validate request query parameters against Joi schema
 * @param {Object} schema - Joi validation schema
 */
exports.validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new ValidationError(message));
    }

    next();
  };
};

// Common validation schemas
const schemas = {
  // User schemas
  user: {
    create: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required()
    }),
    update: Joi.object({
      firstName: Joi.string().min(2).max(50),
      lastName: Joi.string().min(2).max(50),
      phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
      email: Joi.string().email()
    })
  },

  // Vehicle schemas
  vehicle: {
    create: Joi.object({
      make: Joi.string().required(),
      model: Joi.string().required(),
      year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
      licensePlate: Joi.string().required(),
      color: Joi.string().required(),
      type: Joi.string().valid('sedan', 'suv', 'van', 'luxury').required()
    }),
    update: Joi.object({
      make: Joi.string(),
      model: Joi.string(),
      year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
      licensePlate: Joi.string(),
      color: Joi.string(),
      type: Joi.string().valid('sedan', 'suv', 'van', 'luxury')
    })
  },

  // Ride schemas
  ride: {
    create: Joi.object({
      pickupLocation: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        address: Joi.string().required()
      }).required(),
      dropoffLocation: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        address: Joi.string().required()
      }).required(),
      vehicleType: Joi.string().valid('sedan', 'suv', 'van', 'luxury').required(),
      paymentMethodId: Joi.string().required()
    }),
    update: Joi.object({
      status: Joi.string().valid('accepted', 'in_progress', 'completed', 'cancelled'),
      rating: Joi.number().min(1).max(5),
      review: Joi.string().max(500)
    })
  },

  // Review schemas
  review: {
    create: Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().max(500),
      rideId: Joi.string().required()
    }),
    update: Joi.object({
      rating: Joi.number().min(1).max(5),
      comment: Joi.string().max(500)
    })
  },

  // Location schemas
  location: {
    create: Joi.object({
      name: Joi.string().required(),
      type: Joi.string().valid('home', 'work', 'favorite').required(),
      address: Joi.string().required(),
      coordinates: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      }).required()
    }),
    update: Joi.object({
      name: Joi.string(),
      type: Joi.string().valid('home', 'work', 'favorite'),
      address: Joi.string(),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number()
      })
    })
  }
};

// Validate request using express-validator
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    winston.warn('Validation error:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

// Validate location object
const validateLocation = (location) => {
  if (!location || typeof location !== 'object') {
    return false;
  }

  const { latitude, longitude } = location;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return false;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return false;
  }

  return true;
};

// Validate phone number format
const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Validate date range
const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }

  if (start > end) {
    return false;
  }

  // Check if date range is not more than 30 days
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 30) {
    return false;
  }

  return true;
};

// Validate pagination parameters
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || isNaN(limitNum)) {
    return false;
  }

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    return false;
  }

  return true;
};

module.exports = {
  validate,
  validateRequest,
  schemas,
  validateLocation,
  validatePhoneNumber,
  validateEmail,
  validatePassword,
  validateDateRange,
  validatePagination,
}; 