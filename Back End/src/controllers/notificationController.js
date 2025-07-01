const { Notification, User, Ride } = require('../models');
const { sendEmail } = require('../utils/emailUtils');
const winston = require('winston');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, isRead } = req.query;

    const where = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const notifications = await Notification.findAndCountAll({
      where,
      include: [
        { model: Ride, attributes: ['id', 'status', 'origin', 'destination'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });

    res.json({
      success: true,
      data: {
        notifications: notifications.rows,
        total: notifications.count,
        page: parseInt(page),
        totalPages: Math.ceil(notifications.count / limit)
      }
    });
  } catch (error) {
    winston.error('Error in getUserNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.update({ isRead: true });

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    winston.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { isRead: true },
      {
        where: {
          userId,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    winston.error('Error in markAllAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    winston.error('Error in deleteNotification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// Create notification (internal use)
exports.createNotification = async ({
  userId,
  rideId,
  type,
  title,
  message,
  channel = 'IN_APP',
  metadata = {}
}) => {
  try {
    const notification = await Notification.create({
      userId,
      rideId,
      type,
      title,
      message,
      channel,
      metadata
    });

    if (channel === 'EMAIL' || channel === 'ALL') {
      const user = await User.findByPk(userId);
      if (user && user.email) {
        await sendEmail({
          to: user.email,
          subject: title,
          text: message
        });
      }
    }

    return notification;
  } catch (error) {
    winston.error('Error in createNotification:', error);
    throw error;
  }
};

// Add placeholder handlers for missing notification routes
const defaultNotImplemented = (name) => async (req, res) => {
  res.status(501).json({ success: false, message: `${name} not implemented` });
};

exports.getNotifications = defaultNotImplemented('getNotifications');
exports.getPreferences = defaultNotImplemented('getPreferences');
exports.updatePreferences = defaultNotImplemented('updatePreferences');
exports.sendNotification = defaultNotImplemented('sendNotification');
exports.getNotificationHistory = defaultNotImplemented('getNotificationHistory');
exports.getNotificationDetails = defaultNotImplemented('getNotificationDetails'); 