// This file defines what information we store about each user in our ride-sharing app
// A user can be a rider (someone who needs a ride) or a driver (someone who gives rides)

'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Check if a password matches the user's stored password
     * This is used when users try to log in
     * 
     * @param {string} password - The password to check
     * @returns {Promise<boolean>} True if the password matches
     */
    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }

    /**
     * Define how this model connects to other models in our database
     * This helps us easily get related information (like all rides a user has taken)
     */
    static associate(models) {
      // A user can be a rider in many rides
      User.hasMany(models.Ride, {
        foreignKey: 'rider_id',
        as: 'ridesAsRider'
      });

      // A user can be a driver in many rides
      User.hasMany(models.Ride, {
        foreignKey: 'driver_id',
        as: 'ridesAsDriver'
      });

      // A driver can have many vehicles
      User.hasMany(models.Vehicle, {
        foreignKey: 'driver_id',
        as: 'vehicles'
      });

      // A user can make many payments as a rider
      User.hasMany(models.Payment, {
        foreignKey: 'rider_id',
        as: 'paymentsAsRider'
      });

      // A user can receive many payments as a driver
      User.hasMany(models.Payment, {
        foreignKey: 'driver_id',
        as: 'paymentsAsDriver'
      });

      // A user can give many reviews
      User.hasMany(models.Review, {
        foreignKey: 'reviewer_id',
        as: 'reviewsGiven'
      });

      // A user can receive many reviews
      User.hasMany(models.Review, {
        foreignKey: 'reviewee_id',
        as: 'reviewsReceived'
      });

      // A user can have many notifications
      User.hasMany(models.Notification, {
        foreignKey: 'user_id',
        as: 'notifications'
      });

      // A user can save many locations (like home, work, etc.)
      User.hasMany(models.Location, {
        foreignKey: 'user_id',
        as: 'locations'
      });

      // A user has one set of preferences
      User.hasOne(models.UserPreference, {
        foreignKey: 'user_id',
        as: 'preferences'
      });

      // A user can have many price history records
      User.hasMany(models.PriceHistory, {
        foreignKey: 'user_id',
        as: 'priceHistory'
      });

      // A user can have many fare estimates
      User.hasMany(models.FareEstimate, {
        foreignKey: 'user_id',
        as: 'fareEstimates'
      });
    }
  }

  // Define all the information we store about each user
  User.init({
    // A unique ID for each user
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // User's email address (must be unique)
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    // User's password (stored securely using bcrypt)
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // User's first name
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // User's last name
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // User's phone number (must be unique)
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    // What type of user they are (rider, driver, or admin)
    role: {
      type: DataTypes.ENUM('rider', 'driver', 'admin'),
      defaultValue: 'rider'
    },

    // Whether they've verified their email
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // Whether they've verified their phone
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // Current status of their account
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },

    // When they last logged in
    lastLoginAt: {
      type: DataTypes.DATE
    },

    // How many times they've failed to log in
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    // When their account will be unlocked (if locked)
    accountLockedUntil: {
      type: DataTypes.DATE
    },

    // When the account was created
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },

    // When the account was last updated
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },

    // When the account was deleted (if it was)
    deletedAt: {
      type: DataTypes.DATE
    },

    // Token for sending push notifications to their device
    deviceToken: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Firebase Cloud Messaging device token for push notifications'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    paranoid: true, // Don't actually delete users, just mark them as deleted
    underscored: true, // Use snake_case for database columns
    indexes: [
      { fields: ['email'] },
      { fields: ['phone_number'] },
      { fields: ['role'] },
      { fields: ['status'] }
    ]
  });

  return User;
}; 