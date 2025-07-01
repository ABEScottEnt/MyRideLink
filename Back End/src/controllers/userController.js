const { User, Vehicle, Ride } = require('../models');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');
const { logger } = require('../config/logger');

// Get user profile
async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
}

// Update user profile
async function updateProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await user.update(req.body);

    res.json({
      status: 'success',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phoneNumber: updatedUser.phoneNumber,
          role: updatedUser.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

// Change password
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ValidationError('Current password is incorrect');
    }

    await user.update({ password: newPassword });

    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
}

// Get user's vehicles
async function getVehicles(req, res, next) {
  try {
    const vehicles = await Vehicle.findAll({
      where: { driver_id: req.user.id }
    });

    res.json({
      status: 'success',
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
}

// Get user's rides
async function getRides(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const rides = await Ride.findAndCountAll({
      where: { rider_id: req.user.id },
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'make', 'model', 'color', 'license_plate']
        }
      ]
    });

    res.json({
      status: 'success',
      data: {
        rides: rides.rows,
        pagination: {
          total: rides.count,
          page,
          limit,
          pages: Math.ceil(rides.count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user's device token for push notifications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function updateDeviceToken(req, res) {
  try {
    const { deviceToken } = req.body;
    const userId = req.user.id;

    await User.update(
      { deviceToken },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: 'Device token updated successfully'
    });
  } catch (error) {
    logger.error('Error updating device token:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating device token',
      error: error.message
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getVehicles,
  getRides,
  updateDeviceToken
}; 