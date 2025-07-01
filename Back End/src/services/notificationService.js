const nodemailer = require('nodemailer');
const { Ride, User, Driver, Notification, UserPreference, Payment } = require('../models');
const logger = require('../config/logger');
const { sendEmail } = require('../utils/emailUtils');
const { sendPushNotification, sendMulticastPushNotification } = require('../config/firebase');
const { Op } = require('sequelize');

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email notification
const sendEmailNotification = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    await emailTransporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

// Send ride confirmation notification
const sendRideConfirmation = async (rideId) => {
  try {
    const ride = await Ride.findByPk(rideId, {
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['email', 'firstName'],
        },
        {
          model: Driver,
          include: [{
            model: User,
            attributes: ['email', 'firstName'],
          }],
        },
      ],
    });

    if (!ride) {
      throw new Error('Ride not found');
    }

    // Send email to rider
    await sendEmailNotification(
      ride.rider.email,
      'Ride Confirmed - My Ride Link™',
      `
        <h1>Your ride has been confirmed!</h1>
        <p>Hello ${ride.rider.firstName},</p>
        <p>Your ride has been confirmed. Here are the details:</p>
        <ul>
          <li>Driver: ${ride.Driver.User.firstName}</li>
          <li>Estimated fare: $${ride.estimatedFare}</li>
          <li>Estimated duration: ${Math.round(ride.estimatedDuration)} minutes</li>
        </ul>
        <p>Your driver will arrive shortly.</p>
        <p>Best regards,<br>The My Ride Link™ Team</p>
      `
    );

    // Send email to driver
    await sendEmailNotification(
      ride.Driver.User.email,
      'New Ride Request - My Ride Link™',
      `
        <h1>New Ride Request</h1>
        <p>Hello ${ride.Driver.User.firstName},</p>
        <p>You have a new ride request. Here are the details:</p>
        <ul>
          <li>Estimated fare: $${ride.estimatedFare}</li>
          <li>Estimated duration: ${Math.round(ride.estimatedDuration)} minutes</li>
        </ul>
        <p>Please proceed to pick up the rider.</p>
        <p>Best regards,<br>The My Ride Link™ Team</p>
      `
    );
  } catch (error) {
    logger.error('Error sending ride confirmation:', error);
    throw error;
  }
};

// Send ride status update notification
const sendRideStatusUpdate = async (rideId, status) => {
  try {
    const ride = await Ride.findByPk(rideId, {
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['email', 'firstName'],
        },
        {
          model: Driver,
          include: [{
            model: User,
            attributes: ['email', 'firstName'],
          }],
        },
      ],
    });

    if (!ride) {
      throw new Error('Ride not found');
    }

    const statusMessages = {
      in_progress: {
        subject: 'Ride Started - My Ride Link™',
        emailBody: `
          <h1>Your ride has started!</h1>
          <p>Hello ${ride.rider.firstName},</p>
          <p>Your ride with ${ride.Driver.User.firstName} has started.</p>
          <p>Best regards,<br>The My Ride Link™ Team</p>
        `,
      },
      completed: {
        subject: 'Ride Completed - My Ride Link™',
        emailBody: `
          <h1>Your ride has been completed!</h1>
          <p>Hello ${ride.rider.firstName},</p>
          <p>Thank you for using My Ride Link™. We hope you had a great ride!</p>
          <p>Best regards,<br>The My Ride Link™ Team</p>
        `,
      },
      cancelled: {
        subject: 'Ride Cancelled - My Ride Link™',
        emailBody: `
          <h1>Your ride has been cancelled</h1>
          <p>Hello ${ride.rider.firstName},</p>
          <p>Your ride has been cancelled. If you need another ride, please request a new one.</p>
          <p>Best regards,<br>The My Ride Link™ Team</p>
        `,
      },
    };

    const message = statusMessages[status];
    if (!message) {
      throw new Error('Invalid ride status');
    }

    // Send email to rider
    await sendEmailNotification(ride.rider.email, message.subject, message.emailBody);
  } catch (error) {
    logger.error('Error sending ride status update:', error);
    throw error;
  }
};

// Send payment confirmation notification
const sendPaymentConfirmation = async (paymentId) => {
  try {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        {
          model: Ride,
          include: [
            {
              model: User,
              as: 'rider',
              attributes: ['email', 'firstName'],
            },
            {
              model: Driver,
              include: [{
                model: User,
                attributes: ['email', 'firstName'],
              }],
            },
          ],
        },
      ],
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Send email to rider
    await sendEmailNotification(
      payment.Ride.rider.email,
      'Payment Confirmed - My Ride Link™',
      `
        <h1>Payment Confirmed</h1>
        <p>Hello ${payment.Ride.rider.firstName},</p>
        <p>Your payment of $${payment.amount} has been confirmed.</p>
        <p>Thank you for using My Ride Link™!</p>
        <p>Best regards,<br>The My Ride Link™ Team</p>
      `
    );

    // Send email to driver
    await sendEmailNotification(
      payment.Ride.Driver.User.email,
      'Payment Received - My Ride Link™',
      `
        <h1>Payment Received</h1>
        <p>Hello ${payment.Ride.Driver.User.firstName},</p>
        <p>You have received a payment of $${payment.amount} for your ride.</p>
        <p>Best regards,<br>The My Ride Link™ Team</p>
      `
    );
  } catch (error) {
    logger.error('Error sending payment confirmation:', error);
    throw error;
  }
};

/**
 * Send notification to a user
 * @param {Object} notification - Notification object
 * @param {string} notification.type - Type of notification
 * @param {string} notification.message - Message content
 * @param {number} notification.recipientId - User ID to send notification to
 * @param {Object} notification.metadata - Additional data
 * @returns {Promise<Object>} - Created notification
 */
const sendNotification = async ({ type, message, recipientId, metadata = {} }) => {
  try {
    // Get user preferences
    const userPreference = await UserPreference.findOne({
      where: { userId: recipientId }
    });

    if (!userPreference) {
      throw new Error('User preferences not found');
    }

    // Create notification record
    const notification = await Notification.create({
      type,
      message,
      recipientId,
      metadata,
      status: 'PENDING'
    });

    // Send email if enabled
    if (userPreference.emailNotifications) {
      const user = await User.findByPk(recipientId);
      if (user && user.email) {
        await sendEmail({
          to: user.email,
          subject: `RideLink Notification: ${type}`,
          text: message,
          html: `<p>${message}</p>`
        });
      }
    }

    // Send push notification if enabled
    if (userPreference.pushNotifications) {
      const user = await User.findByPk(recipientId);
      if (user && user.deviceToken) {
        await sendPushNotification(
          user.deviceToken,
          {
            title: `RideLink: ${type}`,
            body: message
          },
          {
            notificationId: notification.id,
            type,
            ...metadata
          }
        );
      }
    }

    // Update notification status
    await notification.update({ status: 'SENT' });

    return notification;
  } catch (error) {
    logger.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Send notification to multiple users
 * @param {Object} notification - Notification object
 * @param {string} notification.type - Type of notification
 * @param {string} notification.message - Message content
 * @param {number[]} notification.recipientIds - Array of user IDs
 * @param {Object} notification.metadata - Additional data
 * @returns {Promise<Object[]>} - Created notifications
 */
const sendBulkNotification = async ({ type, message, recipientIds, metadata = {} }) => {
  try {
    // Get users with push notifications enabled
    const users = await User.findAll({
      include: [{
        model: UserPreference,
        where: { pushNotifications: true }
      }],
      where: {
        id: recipientIds,
        deviceToken: { [Op.ne]: null }
      }
    });

    // Send push notifications in bulk
    if (users.length > 0) {
      const tokens = users.map(user => user.deviceToken);
      await sendMulticastPushNotification(
        tokens,
        {
          title: `RideLink: ${type}`,
          body: message
        },
        {
          type,
          ...metadata
        }
      );
    }

    // Create notification records
    const notifications = await Promise.all(
      recipientIds.map(recipientId =>
        Notification.create({
          type,
          message,
          recipientId,
          metadata,
          status: 'SENT'
        })
      )
    );

    return notifications;
  } catch (error) {
    logger.error('Error sending bulk notification:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendRideConfirmation,
  sendRideStatusUpdate,
  sendPaymentConfirmation,
  sendNotification,
  sendBulkNotification
}; 