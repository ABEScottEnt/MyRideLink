// This file defines what information we store about each user's preferences in our ride-sharing app
// Preferences help customize the app experience for each user

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserPreference extends Model {
    /**
     * Define how this model connects to other models in our database
     * This helps us easily get related information (like which user these preferences belong to)
     */
    static associate(models) {
      // Each set of preferences belongs to one user
      UserPreference.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  // Define all the information we store about each user's preferences
  UserPreference.init({
    // A unique ID for each set of preferences
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // The ID of the user these preferences belong to
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    // The user's preferred language
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en',
      allowNull: false
    },

    // The user's preferred currency
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
      allowNull: false
    },

    // The user's preferred time zone
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC',
      allowNull: false
    },

    // Whether the user wants to receive email notifications
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'email_notifications'
    },

    // Whether the user wants to receive push notifications
    pushNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'push_notifications'
    },

    // Whether the user wants to receive SMS notifications
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'sms_notifications'
    },

    // The user's preferred theme (light or dark)
    theme: {
      type: DataTypes.ENUM('light', 'dark'),
      defaultValue: 'light'
    },

    // The user's preferred map style
    mapStyle: {
      type: DataTypes.ENUM('standard', 'satellite', 'hybrid'),
      defaultValue: 'standard',
      field: 'map_style'
    },

    // The user's preferred units (metric or imperial)
    units: {
      type: DataTypes.ENUM('metric', 'imperial'),
      defaultValue: 'metric'
    },

    // When the preferences were created
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },

    // When the preferences were last updated
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },

    // When the preferences were deleted (if they were)
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'UserPreference',
    tableName: 'user_preferences',
    paranoid: true, // Don't actually delete preferences, just mark them as deleted
    underscored: true, // Use snake_case for database columns
    indexes: [
      // Index for quickly finding preferences by user
      {
        fields: ['user_id'],
        unique: true // Each user can only have one set of preferences
      }
    ]
  });

  return UserPreference;
}; 