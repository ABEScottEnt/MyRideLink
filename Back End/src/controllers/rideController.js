const rideMatchingService = require('../services/rideMatchingService');
const { Ride, User, Payment, Notification } = require('../models');
const { Op } = require('sequelize');
// const Driver = require('../models/Driver');
const { logger } = require('../config/logger');
const { calculateFare, calculateDistance, isValidCoordinate } = require('../utils/geoUtils');
const { createStripeCheckoutSession } = require('../utils/paymentUtils');
const { sendEmail } = require('../utils/emailUtils');
const winston = require('winston');
const { sendRideConfirmation, sendRideStatusUpdate } = require('../services/notificationService');

/**
 * Request a new ride
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requestRide = async (req, res, next) => {
  try {
    const { origin, destination, paymentMethod } = req.body;
    const riderId = req.user.id;

    // Validate coordinates
    if (!isValidCoordinate(origin.latitude, origin.longitude) ||
        !isValidCoordinate(destination.latitude, destination.longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    // Calculate distance and fare
    const distance = calculateDistance(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude
    );
    const fare = calculateFare(distance);

    // Create ride record
    const ride = await Ride.create({
      riderId,
      origin: JSON.stringify(origin),
      destination: JSON.stringify(destination),
      status: 'PENDING',
      estimatedFare: fare,
      paymentMethod
    });

    // Create payment record
    await Payment.create({
      rideId: ride.id,
      amount: fare,
      status: 'PENDING',
      paymentMethod
    });

    // Send notification
    await sendRideConfirmation(ride.id);

    res.status(201).json({
      success: true,
      message: 'Ride requested successfully',
      data: {
        rideId: ride.id,
        estimatedFare: fare,
        status: ride.status
      }
    });
  } catch (error) {
    winston.error('Error in requestRide:', error);
    next(error);
  }
};

// Update ride status
const updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const ride = await Ride.findByPk(rideId, {
      include: [
        { model: User, as: 'rider' },
        { model: User, as: 'driver' }
      ]
    });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is authorized to update status
    if (req.user.role !== 'ADMIN' && 
        userId !== ride.driverId && 
        userId !== ride.riderId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update ride status'
      });
    }

    // Validate status transition
    const validTransitions = {
      PENDING: ['ACCEPTED', 'CANCELLED'],
      ACCEPTED: ['STARTED', 'CANCELLED'],
      STARTED: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: []
    };

    if (!validTransitions[ride.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${ride.status} to ${status}`
      });
    }

    // Update ride status
    const updates = { status };
    if (status === 'STARTED') {
      updates.startTime = new Date();
    } else if (status === 'COMPLETED') {
      updates.endTime = new Date();
    }

    await ride.update(updates);

    // Send notification
    await sendRideStatusUpdate(ride.id, status);

    // Send email
    await sendEmail({
      to: ride.rider.email,
      subject: `Ride ${status.toLowerCase()}`,
      text: `Your ride has been ${status.toLowerCase()}`
    });

    res.json({
      success: true,
      data: ride
    });
  } catch (error) {
    winston.error('Error in updateRideStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ride status',
      error: error.message
    });
  }
};

// Update driver location
const updateLocation = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { latitude, longitude } = req.body;

    await rideMatchingService.updateDriverLocation(driverId, latitude, longitude);

    res.json({
      message: 'Location updated successfully',
    });
  } catch (error) {
    logger.error('Error updating driver location:', error);
    next(error);
  }
};

// Get ride details
const getRideDetails = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.user.id;

    const ride = await Ride.findByPk(rideId, {
      include: [
        { model: User, as: 'rider' },
        { model: User, as: 'driver' },
        { model: Payment }
      ]
    });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is authorized to view ride details
    if (req.user.role !== 'ADMIN' && 
        userId !== ride.driverId && 
        userId !== ride.riderId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view ride details'
      });
    }

    res.json({
      success: true,
      data: ride
    });
  } catch (error) {
    winston.error('Error in getRideDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ride details',
      error: error.message
    });
  }
};

/**
 * Get active rides for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getActiveRides = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const rides = await Ride.findAll({
      where: {
        [Op.or]: [
          { riderId: userId },
          { driverId: userId }
        ],
        status: {
          [Op.in]: ['PENDING', 'ACCEPTED', 'STARTED']
        }
      },
      include: [
        { model: User, as: 'rider' },
        { model: User, as: 'driver' },
        { model: Payment }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rides
    });
  } catch (error) {
    winston.error('Error in getActiveRides:', error);
    next(error);
  }
};

/**
 * Get ride history for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getRideHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const rides = await Ride.findAndCountAll({
      where: {
        [Op.or]: [
          { riderId: userId },
          { driverId: userId }
        ]
      },
      include: [
        { model: User, as: 'rider' },
        { model: User, as: 'driver' },
        { model: Payment }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        rides: rides.rows,
        pagination: {
          total: rides.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(rides.count / limit)
        }
      }
    });
  } catch (error) {
    winston.error('Error in getRideHistory:', error);
    next(error);
  }
};

/**
 * Book a new ride
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const bookRide = async (req, res, next) => {
  try {
    const {
      origin,
      destination,
      paymentMethod,
      estimatedFare,
      scheduledTime
    } = req.body;

    const riderId = req.user.id;

    // Validate coordinates
    if (!isValidCoordinate(origin.latitude, origin.longitude) ||
        !isValidCoordinate(destination.latitude, destination.longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    // Calculate actual fare
    const distance = calculateDistance(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude
    );
    const actualFare = calculateFare(distance);

    // Create ride record
    const ride = await Ride.create({
      riderId,
      origin: JSON.stringify(origin),
      destination: JSON.stringify(destination),
      status: 'PENDING',
      estimatedFare,
      actualFare,
      scheduledTime: scheduledTime || new Date(),
      paymentMethod
    });

    // Create payment record
    await Payment.create({
      rideId: ride.id,
      amount: actualFare,
      status: 'PENDING',
      paymentMethod
    });

    // Send notification
    await sendRideConfirmation(ride.id);

    res.status(201).json({
      success: true,
      message: 'Ride booked successfully',
      data: {
        rideId: ride.id,
        estimatedFare: actualFare,
        status: ride.status
      }
    });
  } catch (error) {
    winston.error('Error in bookRide:', error);
    next(error);
  }
};

/**
 * Rate a completed ride
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const rateRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const ride = await Ride.findByPk(rideId, {
      include: [
        { model: User, as: 'rider' },
        { model: User, as: 'driver' }
      ]
    });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is authorized to rate the ride
    if (userId !== ride.riderId) {
      return res.status(403).json({
        success: false,
        message: 'Only the rider can rate this ride'
      });
    }

    // Check if ride is completed
    if (ride.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed rides'
      });
    }

    // Update ride with rating
    await ride.update({
      rating,
      ratingComment: comment,
      ratedAt: new Date()
    });

    // Create notification for driver
    await sendRideStatusUpdate(ride.id, 'RATED');

    res.json({
      success: true,
      message: 'Ride rated successfully',
      data: {
        rideId: ride.id,
        rating,
        comment
      }
    });
  } catch (error) {
    winston.error('Error in rateRide:', error);
    next(error);
  }
};

// Placeholder for any missing handlers
const ensureHandler = (name) => (req, res) => res.json({ message: `${name} not implemented` });

// List of all handlers that should be exported
const handlers = {
  requestRide: typeof requestRide === 'function' ? requestRide : ensureHandler('requestRide'),
  updateRideStatus: typeof updateRideStatus === 'function' ? updateRideStatus : ensureHandler('updateRideStatus'),
  updateLocation: typeof updateLocation === 'function' ? updateLocation : ensureHandler('updateLocation'),
  getRideDetails: typeof getRideDetails === 'function' ? getRideDetails : ensureHandler('getRideDetails'),
  getActiveRides: typeof getActiveRides === 'function' ? getActiveRides : ensureHandler('getActiveRides'),
  getRideHistory: typeof getRideHistory === 'function' ? getRideHistory : ensureHandler('getRideHistory'),
  bookRide: typeof bookRide === 'function' ? bookRide : ensureHandler('bookRide'),
  rateRide: typeof rateRide === 'function' ? rateRide : ensureHandler('rateRide'),
};

module.exports = handlers; 