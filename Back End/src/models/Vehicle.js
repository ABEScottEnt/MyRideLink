// This file defines what information we store about each vehicle in our ride-sharing app
// Vehicles are used by drivers to give rides to riders

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Define how this model connects to other models in our database
     * This helps us easily get related information (like who owns the vehicle)
     */
    static associate(models) {
      // Each vehicle belongs to one driver
      Vehicle.belongsTo(models.User, {
        foreignKey: 'driver_id',
        as: 'driver'
      });

      // A vehicle can be used in many rides
      Vehicle.hasMany(models.Ride, {
        foreignKey: 'vehicle_id',
        as: 'rides'
      });
    }
  }

  // Define all the information we store about each vehicle
  Vehicle.init({
    // A unique ID for each vehicle
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // The ID of the driver who owns this vehicle
    driverId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'driver_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    // The make of the vehicle (e.g., Toyota, Honda)
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // The model of the vehicle (e.g., Camry, Civic)
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // The year the vehicle was made
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // The color of the vehicle
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // The vehicle's license plate number (must be unique)
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'license_plate'
    },

    // The type of vehicle (sedan, SUV, luxury, or van)
    vehicleType: {
      type: DataTypes.ENUM('sedan', 'suv', 'luxury', 'van'),
      allowNull: false,
      field: 'vehicle_type'
    },

    // Current status of the vehicle
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
      defaultValue: 'active'
    },

    // When the vehicle was added to our system
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },

    // When the vehicle information was last updated
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },

    // When the vehicle was removed from our system (if it was)
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    paranoid: true, // Don't actually delete vehicles, just mark them as deleted
    underscored: true, // Use snake_case for database columns
    indexes: [
      // Index for quickly finding vehicles by driver
      {
        fields: ['driver_id']
      },
      // Index for quickly finding vehicles by license plate
      {
        fields: ['license_plate'],
        unique: true
      }
    ]
  });

  return Vehicle;
}; 