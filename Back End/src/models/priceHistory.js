// This file defines what information we store about price history in our ride-sharing app
// Price history helps track how ride prices change over time and in different areas

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PriceHistory extends Model {
    /**
     * Define how this model connects to other models in our database
     * This helps us easily get related information (like which user this price history belongs to)
     */
    static associate(models) {
      // Each price history record belongs to one user
      PriceHistory.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  // Define all the information we store about each price history record
  PriceHistory.init({
    // A unique ID for each price history record
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // The ID of the user this price history belongs to
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

    // The base price for the ride
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'base_price'
    },

    // Any surge multiplier applied to the price
    surgeMultiplier: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 1.0,
      field: 'surge_multiplier'
    },

    // The final price after all adjustments
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'final_price'
    },

    // The distance of the ride in kilometers
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    // The estimated duration of the ride in minutes
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // The type of vehicle used
    vehicleType: {
      type: DataTypes.ENUM('sedan', 'suv', 'luxury', 'van'),
      allowNull: false,
      field: 'vehicle_type'
    },

    // The time of day when the price was recorded
    timeOfDay: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'time_of_day'
    },

    // The day of the week when the price was recorded
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'day_of_week'
    },

    // Any special events or conditions affecting the price
    specialConditions: {
      type: DataTypes.JSON,
      defaultValue: {},
      field: 'special_conditions'
    },

    // When the price history record was created
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },

    // When the price history record was last updated
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },

    // When the price history record was deleted (if it was)
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'PriceHistory',
    tableName: 'price_history',
    paranoid: true, // Don't actually delete price history records, just mark them as deleted
    underscored: true, // Use snake_case for database columns
    indexes: [
      // Index for quickly finding price history by user
      {
        fields: ['user_id']
      },
      // Index for quickly finding price history by time
      {
        fields: ['time_of_day']
      },
      // Index for quickly finding price history by day of week
      {
        fields: ['day_of_week']
      },
      // Index for quickly finding price history by vehicle type
      {
        fields: ['vehicle_type']
      }
    ]
  });

  return PriceHistory;
}; 