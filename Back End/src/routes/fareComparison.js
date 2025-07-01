const express = require('express');
const router = express.Router();
const fareComparisonController = require('../controllers/fareComparisonController');
const { authenticate } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Compare fares between Uber and Lyft
router.post('/compare', fareComparisonController.compareFares);

// Get price history for a specific route
router.get('/history/:route', fareComparisonController.getPriceHistory);

// Get best time to ride analysis for a specific route
router.get('/best-time/:route', fareComparisonController.getBestTimeToRide);

module.exports = router; 