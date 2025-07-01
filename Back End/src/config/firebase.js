const admin = require('firebase-admin');
const logger = require('./logger');

// Initialize Firebase Admin
let firebaseApp;
try {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
  logger.info('Firebase Admin initialized successfully');
} catch (error) {
  logger.error('Error initializing Firebase Admin:', error);
  firebaseApp = null;
}

/**
 * Send push notification to a specific device
 * @param {string} token - FCM device token
 * @param {Object} notification - Notification object
 * @param {Object} data - Additional data to send
 * @returns {Promise<Object>} - FCM response
 */
const sendPushNotification = async (token, notification, data = {}) => {
  if (!firebaseApp) {
    logger.error('Firebase Admin not initialized');
    throw new Error('Firebase Admin not initialized');
  }

  try {
    const message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'ride_updates',
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    logger.info('Push notification sent successfully:', response);
    return response;
  } catch (error) {
    logger.error('Error sending push notification:', error);
    throw error;
  }
};

/**
 * Send push notification to multiple devices
 * @param {string[]} tokens - Array of FCM device tokens
 * @param {Object} notification - Notification object
 * @param {Object} data - Additional data to send
 * @returns {Promise<Object>} - FCM response
 */
const sendMulticastPushNotification = async (tokens, notification, data = {}) => {
  if (!firebaseApp) {
    logger.error('Firebase Admin not initialized');
    throw new Error('Firebase Admin not initialized');
  }

  try {
    const message = {
      tokens,
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'ride_updates',
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await admin.messaging().sendMulticast(message);
    logger.info('Multicast push notification sent successfully:', response);
    return response;
  } catch (error) {
    logger.error('Error sending multicast push notification:', error);
    throw error;
  }
};

module.exports = {
  sendPushNotification,
  sendMulticastPushNotification
}; 