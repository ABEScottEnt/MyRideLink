// This file defines what information we store about each location in our ride-sharing app
// Locations can be saved places like home, work, or favorite destinations

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Define how this model connects to other models in our database
     * This helps us easily get related information (like which user saved this location)
     */
    static associate(models) {
      // Each location belongs to one user
      Location.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  // Define all the information we store about each location
  Location.init({
    // A unique ID for each location
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // The ID of the user who saved this location
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    // The name of the location (e.g., "Home", "Work")
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // The type of location (e.g., home, work, favorite)
    type: {
      type: DataTypes.ENUM('home', 'work', 'favorite'),
      allowNull: false
    },

    // The address of the location
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // The latitude coordinate
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },

    // The longitude coordinate
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },

    // Any additional notes about the location
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // Whether this is the user's default location of this type
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_default'
    },

    // When the location was created
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },

    // When the location was last updated
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },

    // When the location was deleted (if it was)
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Location',
    tableName: 'locations',
    paranoid: true, // Don't actually delete locations, just mark them as deleted
    underscored: true, // Use snake_case for database columns
    indexes: [
      // Index for quickly finding locations by user
      {
        fields: ['user_id']
      },
      // Index for quickly finding locations by type
      {
        fields: ['type']
      },
      // Index for quickly finding default locations
      {
        fields: ['is_default']
      }
    ]
  });

  return Location;
}; 