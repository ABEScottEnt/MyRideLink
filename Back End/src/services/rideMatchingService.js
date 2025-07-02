const { Op } = require('sequelize');
const { Ride, User } = require('../models');
const { calculateDistance } = require('../utils/fareCalculator');
const { calculateFare } = require('../utils/fareCalculator');
const { logger } = require('../config/logger');

const MAX_DISTANCE_KM = 5; // Maximum distance to consider for matching
const MAX_ACTIVE_RIDES = 3; // Maximum number of active rides per driver

// Find available drivers within radius
const findAvailableDrivers = async (location, maxDistance = MAX_DISTANCE_KM) => {
  try {
    const drivers = await User.findAll({
      where: {
        role: 'driver',
        status: 'active',
        isAvailable: true
      },
      attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'currentLatitude', 'currentLongitude', 'vehicleMake', 'vehicleModel', 'vehicleColor', 'licensePlate']
    });

    // Filter drivers by distance
    const nearbyDrivers = drivers.filter(driver => {
      if (!driver.currentLatitude || !driver.currentLongitude) {
        return false; // Skip drivers without location
      }
      const distance = calculateDistance(
        { latitude: driver.currentLatitude, longitude: driver.currentLongitude },
        location
      );
      return distance <= maxDistance;
    });

    // Sort by distance
    return nearbyDrivers.sort((a, b) => {
      const distanceA = calculateDistance(
        { latitude: a.currentLatitude, longitude: a.currentLongitude },
        location
      );
      const distanceB = calculateDistance(
        { latitude: b.currentLatitude, longitude: b.currentLongitude },
        location
      );
      return distanceA - distanceB;
    });
  } catch (error) {
    logger.error('Error finding available drivers:', error);
    throw error;
  }
};

// Check if driver can accept more rides
const canAcceptRide = async (driverId) => {
  try {
    const activeRides = await Ride.count({
      where: {
        driverId,
        status: {
          [Op.in]: ['accepted', 'in_progress'],
        },
      },
    });
    return activeRides < MAX_ACTIVE_RIDES;
  } catch (error) {
    logger.error('Error checking driver ride capacity:', error);
    throw error;
  }
};

// Match rider with best available driver
const matchRiderWithDriver = async (riderId, origin, destination) => {
  try {
    // Find available drivers
    const availableDrivers = await findAvailableDrivers(origin);
    if (availableDrivers.length === 0) {
      throw new Error('No drivers available in your area');
    }

    // Get active rides count for surge pricing
    const activeRides = await Ride.count({
      where: {
        status: {
          [Op.in]: ['accepted', 'in_progress'],
        },
      },
    });

    // Calculate fare
    const fareDetails = calculateFare(
      origin,
      destination,
      activeRides,
      availableDrivers.length
    );

    // Find first available driver that can accept the ride
    let matchedDriver = null;
    for (const driver of availableDrivers) {
      if (await canAcceptRide(driver.id)) {
        matchedDriver = driver;
        break;
      }
    }

    if (!matchedDriver) {
      throw new Error('No drivers available to accept your ride');
    }

    // Create ride request
    const ride = await Ride.create({
      riderId,
      driverId: matchedDriver.id,
      status: 'pending',
      originLatitude: origin.latitude,
      originLongitude: origin.longitude,
      destinationLatitude: destination.latitude,
      destinationLongitude: destination.longitude,
      estimatedDistance: fareDetails.distance,
      estimatedDuration: fareDetails.duration,
      estimatedFare: fareDetails.finalFare,
      surgeMultiplier: fareDetails.surgeMultiplier,
    });

    return {
      ride,
      driver: {
        id: matchedDriver.id,
        firstName: matchedDriver.firstName,
        lastName: matchedDriver.lastName,
        phoneNumber: matchedDriver.phoneNumber,
        vehicleDetails: {
          make: matchedDriver.vehicleMake,
          model: matchedDriver.vehicleModel,
          color: matchedDriver.vehicleColor,
          licensePlate: matchedDriver.licensePlate,
        },
      },
      fare: fareDetails,
    };
  } catch (error) {
    logger.error('Error matching rider with driver:', error);
    throw error;
  }
};

// Update driver location
const updateDriverLocation = async (driverId, latitude, longitude) => {
  try {
    const driver = await User.findByPk(driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    if (driver.role !== 'driver') {
      throw new Error('User is not a driver');
    }

    driver.currentLatitude = latitude;
    driver.currentLongitude = longitude;
    await driver.save();

    logger.info(`Updated location for driver ${driverId}`);
  } catch (error) {
    logger.error('Error updating driver location:', error);
    throw error;
  }
};

// Update ride status
const updateRideStatus = async (rideId, status, driverId = null) => {
  try {
    const ride = await Ride.findByPk(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    if (driverId && ride.driverId !== driverId) {
      throw new Error('Unauthorized to update this ride');
    }

    ride.status = status;
    await ride.save();

    logger.info(`Updated status for ride ${rideId} to ${status}`);
    return ride;
  } catch (error) {
    logger.error('Error updating ride status:', error);
    throw error;
  }
};

module.exports = {
  matchRiderWithDriver,
  updateDriverLocation,
  updateRideStatus,
  findAvailableDrivers,
}; 