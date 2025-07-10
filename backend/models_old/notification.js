'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'userId' });
      Notification.belongsTo(models.Ride, { foreignKey: 'rideId' });
    }
  }

  Notification.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    rideId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Rides',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM(
        'RIDE_REQUEST',
        'RIDE_ACCEPTED',
        'RIDE_STARTED',
        'RIDE_COMPLETED',
        'RIDE_CANCELLED',
        'PAYMENT_RECEIVED',
        'PAYMENT_FAILED',
        'SYSTEM'
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    channel: {
      type: DataTypes.ENUM('EMAIL', 'SMS', 'PUSH', 'IN_APP'),
      defaultValue: 'IN_APP'
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true
  });

  return Notification;
}; 