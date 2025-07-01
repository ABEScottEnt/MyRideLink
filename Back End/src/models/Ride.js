// This file defines what information we store about each ride in our ride-sharing app
// A ride represents a journey from one place to another, with a rider and a driver

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ride extends Model {
    /**
     * Define how this model connects to other models in our database
     * This helps us easily get related information (like who was the rider and driver)
     */
    static associate(models) {
      // Each ride has one rider
      Ride.belongsTo(models.User, { 
        as: 'rider', 
        foreignKey: 'riderId' 
      });

      // Each ride has one driver
      Ride.belongsTo(models.User, { 
        as: 'driver', 
        foreignKey: 'driverId' 
      });

      // Each ride has one payment record
      Ride.hasOne(models.Payment, { 
        foreignKey: 'rideId' 
      });

      // Each ride can have many notifications
      Ride.hasMany(models.Notification, { 
        foreignKey: 'rideId' 
      });
    }
  }

  // Define all the information we store about each ride
  Ride.init({
    // A unique ID for each ride
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // The ID of the person requesting the ride
    riderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    // The ID of the person driving the ride
    driverId: {
      type: DataTypes.UUID,
      allowNull: true, // Can be null when ride is first requested
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    // Where the ride starts (latitude and longitude)
    origin: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },

    // Where the ride ends (latitude and longitude)
    destination: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },

    // Current status of the ride
    status: {
      type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING'
    },

    // How much the ride costs
    fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    // How far the ride is in kilometers
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    // How long the ride is expected to take in minutes
    estimatedDuration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // When the ride actually started
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },

    // When the ride actually ended
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },

    // Whether the payment for the ride has been completed
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
      defaultValue: 'PENDING'
    }
  }, {
    sequelize,
    modelName: 'Ride',
    tableName: 'rides',
    timestamps: true, // Automatically add createdAt and updatedAt
    indexes: [
      // Index for quickly finding rides by rider
      { fields: ['riderId'] },
      // Index for quickly finding rides by driver
      { fields: ['driverId'] },
      // Index for quickly finding rides by status
      { fields: ['status'] },
      // Index for quickly finding rides by payment status
      { fields: ['paymentStatus'] }
    ]
  });

  return Ride;
}; 