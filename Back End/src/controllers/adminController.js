const { User, Ride, Payment } = require('../models');
const { Op } = require('sequelize');
const winston = require('winston');

// Get all users with pagination and filters
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const where = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });

    res.json({
      success: true,
      data: {
        users: users.rows,
        total: users.count,
        page: parseInt(page),
        totalPages: Math.ceil(users.count / limit)
      }
    });
  } catch (error) {
    winston.error('Error in getUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get all rides with pagination and filters
exports.getRides = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const rides = await Ride.findAndCountAll({
      where,
      include: [
        { model: User, as: 'rider', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: User, as: 'driver', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Payment }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });

    res.json({
      success: true,
      data: {
        rides: rides.rows,
        total: rides.count,
        page: parseInt(page),
        totalPages: Math.ceil(rides.count / limit)
      }
    });
  } catch (error) {
    winston.error('Error in getRides:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rides',
      error: error.message
    });
  }
};

// Get all payments with pagination and filters
exports.getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const payments = await Payment.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Ride }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });

    res.json({
      success: true,
      data: {
        payments: payments.rows,
        total: payments.count,
        page: parseInt(page),
        totalPages: Math.ceil(payments.count / limit)
      }
    });
  } catch (error) {
    winston.error('Error in getPayments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ status });
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    winston.error('Error in updateUserStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// Update ride status
exports.updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;

    const ride = await Ride.findByPk(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    await ride.update({ status });
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

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalRides,
      totalPayments,
      activeRides,
      completedRides,
      totalRevenue
    ] = await Promise.all([
      User.count(),
      Ride.count(),
      Payment.count(),
      Ride.count({ where: { status: 'STARTED' } }),
      Ride.count({ where: { status: 'COMPLETED' } }),
      Payment.sum('amount', { where: { status: 'COMPLETED' } })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRides,
        totalPayments,
        activeRides,
        completedRides,
        totalRevenue: totalRevenue || 0
      }
    });
  } catch (error) {
    winston.error('Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
}; 