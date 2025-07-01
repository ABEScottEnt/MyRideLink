// This file defines what information we store about each payment in our ride-sharing app
// Payments represent money transfers between riders and drivers for rides

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Define how this model connects to other models in our database
     * This helps us easily get related information (like which ride this payment is for)
     */
    static associate(models) {
      // Each payment is for one ride
      Payment.belongsTo(models.Ride, {
        foreignKey: 'ride_id',
        as: 'ride'
      });

      // Each payment is made by one rider
      Payment.belongsTo(models.User, {
        foreignKey: 'rider_id',
        as: 'rider'
      });

      // Each payment is received by one driver
      Payment.belongsTo(models.User, {
        foreignKey: 'driver_id',
        as: 'driver'
      });
    }
  }

  // Define all the information we store about each payment
  Payment.init({
    // A unique ID for each payment
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // The ID of the ride this payment is for
    rideId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'ride_id',
      references: {
        model: 'Rides',
        key: 'id'
      }
    },

    // The ID of the rider making the payment
    riderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'rider_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    // The ID of the driver receiving the payment
    driverId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'driver_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    // How much money was paid
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    // What currency the payment was in
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USD'
    },

    // Current status of the payment
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },

    // What payment method was used (e.g., credit card, PayPal)
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'payment_method'
    },

    // Any additional fees charged (e.g., service fee)
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },

    // Any discount applied to the payment
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },

    // The final amount after fees and discounts
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'final_amount'
    },

    // When the payment was processed
    processedAt: {
      type: DataTypes.DATE,
      field: 'processed_at'
    },

    // Any error message if the payment failed
    errorMessage: {
      type: DataTypes.TEXT,
      field: 'error_message'
    },

    // When the payment was created
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },

    // When the payment was last updated
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },

    // When the payment was deleted (if it was)
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    paranoid: true, // Don't actually delete payments, just mark them as deleted
    underscored: true, // Use snake_case for database columns
    indexes: [
      // Index for quickly finding payments by ride
      {
        fields: ['ride_id']
      },
      // Index for quickly finding payments by rider
      {
        fields: ['rider_id']
      },
      // Index for quickly finding payments by driver
      {
        fields: ['driver_id']
      },
      // Index for quickly finding payments by status
      {
        fields: ['status']
      },
      // Index for quickly finding payments by payment method
      {
        fields: ['payment_method']
      }
    ]
  });

  return Payment;
}; 