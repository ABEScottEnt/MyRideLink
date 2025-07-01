const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const { authenticate, requireRole, requireVerified } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const Joi = require('joi');

// Validation schemas
const locationSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});

const rideRequestSchema = Joi.object({
  origin: locationSchema.required(),
  destination: locationSchema.required(),
});

const rideStatusSchema = Joi.object({
  status: Joi.string()
    .valid('accepted', 'rejected', 'in_progress', 'completed', 'cancelled')
    .required(),
});

const locationUpdateSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});

// Public routes (require authentication)
router.post(
  '/request',
  authenticate,
  requireVerified,
  validate(rideRequestSchema),
  rideController.requestRide
);

router.get(
  '/active',
  authenticate,
  requireVerified,
  rideController.getActiveRides
);

router.get(
  '/history',
  authenticate,
  requireVerified,
  rideController.getRideHistory
);

router.get(
  '/:rideId',
  authenticate,
  requireVerified,
  rideController.getRideDetails
);

// Driver-only routes
router.post(
  '/:rideId/status',
  authenticate,
  requireRole(['driver']),
  validate(rideStatusSchema),
  rideController.updateRideStatus
);

router.post(
  '/location',
  authenticate,
  requireRole(['driver']),
  validate(locationUpdateSchema),
  rideController.updateLocation
);

module.exports = router; 