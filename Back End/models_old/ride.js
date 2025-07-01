'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ride extends Model {
    static associate(models) {
      Ride.belongsTo(models.User, { as: 'rider', foreignKey: 'riderId' });
      Ride.belongsTo(models.User, { as: 'driver', foreignKey: 'driverId' });
      Ride.hasOne(models.Payment, { foreignKey: 'rideId' });
      Ride.hasMany(models.Notification, { foreignKey: 'rideId' });
    }
  }

  Ride.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    riderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    origin: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },
    destination: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING'
    },
    fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    estimatedDuration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
      defaultValue: 'PENDING'
    }
  }, {
    sequelize,
    modelName: 'Ride',
    tableName: 'rides',
    timestamps: true
  });

  return Ride;
}; 