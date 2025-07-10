const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

// Apply admin authorization middleware to all routes
router.use(authenticate, requireRole(['ADMIN']));

// Get dashboard statistics
router.get(
  '/dashboard',
  adminController.getDashboardStats
);

// Get all users
router.get(
  '/users',
  adminController.getUsers
);

// Update user status
router.patch(
  '/users/:userId/status',
  [
    body('status')
      .isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
      .withMessage('Invalid user status')
  ],
  adminController.updateUserStatus
);

// Get all rides
router.get(
  '/rides',
  adminController.getRides
);

// Update ride status
router.patch(
  '/rides/:rideId/status',
  [
    body('status')
      .isIn(['PENDING', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED'])
      .withMessage('Invalid ride status')
  ],
  adminController.updateRideStatus
);

// Get all payments
router.get(
  '/payments',
  adminController.getPayments
);

module.exports = router; 