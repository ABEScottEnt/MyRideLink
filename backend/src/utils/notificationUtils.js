const { Notification } = require('../models');
const { logger } = require('../config/logger');

/**
 * Create a new notification
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.userId - User ID
 * @param {string} notificationData.rideId - Ride ID (optional)
 * @param {string} notificationData.type - Notification type
 * @param {string} notificationData.title - Notification title
 * @param {string} notificationData.message - Notification message
 * @param {string} notificationData.channel - Notification channel (IN_APP, EMAIL, SMS, PUSH)
 * @param {Object} notificationData.metadata - Additional metadata
 * @returns {Promise<Object>} - Created notification
 */
const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create({
      userId: notificationData.userId,
      rideId: notificationData.rideId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      channel: notificationData.channel,
      metadata: notificationData.metadata || {},
      status: 'UNREAD'
    });

    logger.info('Notification created successfully:', {
      id: notification.id,
      userId: notification.userId,
      type: notification.type
    });

    return notification;
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Updated notification
 */
const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId: userId
      }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await notification.update({ status: 'READ' });

    logger.info('Notification marked as read:', {
      id: notification.id,
      userId: notification.userId
    });

    return notification;
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Get user notifications
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of notifications to return
 * @param {number} options.offset - Number of notifications to skip
 * @param {string} options.status - Filter by status (READ, UNREAD)
 * @returns {Promise<Array>} - Array of notifications
 */
const getUserNotifications = async (userId, options = {}) => {
  try {
    const { limit = 20, offset = 0, status } = options;

    const whereClause = { userId };
    if (status) {
      whereClause.status = status;
    }

    const notifications = await Notification.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return notifications;
  } catch (error) {
    logger.error('Error getting user notifications:', error);
    throw error;
  }
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteNotification = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId: userId
      }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await notification.destroy();

    logger.info('Notification deleted:', {
      id: notification.id,
      userId: notification.userId
    });

    return true;
  } catch (error) {
    logger.error('Error deleting notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  markNotificationAsRead,
  getUserNotifications,
  deleteNotification
}; 