// This file defines what information we store about each notification in our ride-sharing app
// Notifications keep users informed about important events like ride requests and updates

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Define how this model connects to other models in our database
     * This helps us easily get related information (like which user should receive the notification)
     */
    static associate(models) {
      // Each notification is sent to one user
      Notification.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      // Each notification can be about one ride
      Notification.belongsTo(models.Ride, {
        foreignKey: 'ride_id',
        as: 'ride'
      });
    }
  }

  // Define all the information we store about each notification
  Notification.init({
    // A unique ID for each notification
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // The ID of the user who should receive this notification
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    // The ID of the ride this notification is about (if any)
    rideId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'ride_id',
      references: {
        model: 'Rides',
        key: 'id'
      }
    },

    // The type of notification (e.g., ride_request, payment_received)
    type: {
      type: DataTypes.ENUM(
        'ride_request',
        'ride_accepted',
        'ride_cancelled',
        'ride_completed',
        'payment_received',
        'payment_failed',
        'driver_arrived',
        'promo_code',
        'system_alert'
      ),
      allowNull: false
    },

    // The title of the notification
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // The message content of the notification
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    // Any additional data related to the notification
    data: {
      type: DataTypes.JSON,
      defaultValue: {}
    },

    // Whether the notification has been read
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read'
    },

    // When the notification was read
    readAt: {
      type: DataTypes.DATE,
      field: 'read_at'
    },

    // The priority level of the notification
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },

    // Current status of the notification
    status: {
      type: DataTypes.ENUM('pending', 'sent', 'failed'),
      defaultValue: 'pending'
    },

    // When the notification was created
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },

    // When the notification was last updated
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },

    // When the notification was deleted (if it was)
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    paranoid: true, // Don't actually delete notifications, just mark them as deleted
    underscored: true, // Use snake_case for database columns
    indexes: [
      // Index for quickly finding notifications by user
      {
        fields: ['user_id']
      },
      // Index for quickly finding notifications by ride
      {
        fields: ['ride_id']
      },
      // Index for quickly finding notifications by type
      {
        fields: ['type']
      },
      // Index for quickly finding notifications by status
      {
        fields: ['status']
      },
      // Index for quickly finding unread notifications
      {
        fields: ['is_read']
      }
    ]
  });

  return Notification;
}; 