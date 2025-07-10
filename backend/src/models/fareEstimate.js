// This file defines what information we store about fare estimates in our ride-sharing app
// Fare estimates help users know how much their ride will cost before booking

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FareEstimate extends Model {
    /**
     * Define how this model connects to other models in our database
     * This helps us easily get related information (like which user requested this estimate)
     */
    static associate(models) {
      // Each fare estimate belongs to one user
      FareEstimate.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  // Define all the information we store about each fare estimate
  FareEstimate.init({
    // A unique ID for each fare estimate
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // The ID of the user who requested this estimate
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    // The starting location of the ride
    origin: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },

    // The ending location of the ride
    destination: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },

    // The estimated distance in kilometers
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    // The estimated duration in minutes
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // The type of vehicle requested
    vehicleType: {
      type: DataTypes.ENUM('sedan', 'suv', 'luxury', 'van'),
      allowNull: false,
      field: 'vehicle_type'
    },

    // The base fare for the ride
    baseFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'base_fare'
    },

    // Any surge multiplier applied to the fare
    surgeMultiplier: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 1.0,
      field: 'surge_multiplier'
    },

    // Any additional fees (e.g., tolls, airport fees)
    additionalFees: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: 'additional_fees'
    },

    // The estimated total fare
    totalFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_fare'
    },

    // The currency of the fare
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
      allowNull: false
    },

    // Whether this estimate was used to book a ride
    wasUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'was_used'
    },

    // When the estimate was created
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },

    // When the estimate was last updated
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },

    // When the estimate was deleted (if it was)
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'FareEstimate',
    tableName: 'fare_estimates',
    paranoid: true, // Don't actually delete fare estimates, just mark them as deleted
    underscored: true, // Use snake_case for database columns
    indexes: [
      // Index for quickly finding fare estimates by user
      {
        fields: ['user_id']
      },
      // Index for quickly finding fare estimates by vehicle type
      {
        fields: ['vehicle_type']
      },
      // Index for quickly finding fare estimates by creation time
      {
        fields: ['created_at']
      }
    ]
  });

  return FareEstimate;
}; 