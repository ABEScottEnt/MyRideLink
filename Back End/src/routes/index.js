const express = require('express');
const healthController = require('../controllers/healthController');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./auth');
const rideRoutes = require('./ride');
const paymentRoutes = require('./payment');
const notificationRoutes = require('./notification');
const adminRoutes = require('./admin');

const router = express.Router();

// Health check routes
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// Ride routes
router.use('/rides', rideRoutes);

// Payment routes
router.use('/payments', paymentRoutes);

// Notification routes
router.use('/notifications', notificationRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// API versioning
const v1Router = express.Router();

// Mount v1 routes
v1Router.use('/auth', authRoutes);
v1Router.use('/rides', rideRoutes);
v1Router.use('/payments', paymentRoutes);
// Add other v1 routes as needed

router.use('/api/v1', v1Router);

// Import and mount other route modules
// TODO: Add other route modules as they are created
// v1Router.use('/auth', require('./auth'));
// v1Router.use('/users', require('./users'));
// v1Router.use('/rides', require('./rides'));
// v1Router.use('/vehicles', require('./vehicles'));
// v1Router.use('/payments', require('./payments'));
// v1Router.use('/reviews', require('./reviews'));
// v1Router.use('/notifications', require('./notifications'));
// v1Router.use('/locations', require('./locations'));

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});

module.exports = router; 