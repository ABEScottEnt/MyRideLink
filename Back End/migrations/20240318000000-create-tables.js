'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      role: {
        type: Sequelize.ENUM('rider', 'driver', 'admin'),
        defaultValue: 'rider'
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_phone_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active'
      },
      last_login_at: {
        type: Sequelize.DATE
      },
      failed_login_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      account_locked_until: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Create Vehicles table
    await queryInterface.createTable('Vehicles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      driver_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      make: {
        type: Sequelize.STRING,
        allowNull: false
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      license_plate: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('sedan', 'suv', 'luxury', 'van', 'electric'),
        allowNull: false
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      status: {
        type: Sequelize.ENUM('active', 'maintenance', 'inactive'),
        defaultValue: 'active'
      },
      documents: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          registration: null,
          insurance: null,
          inspection: null
        }
      },
      features: {
        type: Sequelize.JSON,
        defaultValue: {
          air_conditioning: true,
          bluetooth: true,
          wifi: false,
          child_seat: false
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Create Rides table
    await queryInterface.createTable('Rides', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      rider_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      driver_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      vehicle_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Vehicles',
          key: 'id'
        }
      },
      pickup_location: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      },
      dropoff_location: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      },
      pickup_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dropoff_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'accepted',
          'arrived',
          'in_progress',
          'completed',
          'cancelled',
          'no_show'
        ),
        defaultValue: 'pending'
      },
      scheduled_at: {
        type: Sequelize.DATE
      },
      started_at: {
        type: Sequelize.DATE
      },
      completed_at: {
        type: Sequelize.DATE
      },
      estimated_duration: {
        type: Sequelize.INTEGER // in minutes
      },
      actual_duration: {
        type: Sequelize.INTEGER // in minutes
      },
      estimated_distance: {
        type: Sequelize.FLOAT // in kilometers
      },
      actual_distance: {
        type: Sequelize.FLOAT // in kilometers
      },
      base_fare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      surge_multiplier: {
        type: Sequelize.FLOAT,
        defaultValue: 1.0
      },
      total_fare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.ENUM('card', 'cash', 'wallet'),
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT
      },
      cancellation_reason: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Create Payments table
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      ride_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Rides',
          key: 'id'
        }
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD'
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.ENUM('card', 'cash', 'wallet'),
        allowNull: false
      },
      payment_provider: {
        type: Sequelize.ENUM('stripe', 'cash', 'wallet'),
        allowNull: false
      },
      transaction_id: {
        type: Sequelize.STRING,
        unique: true
      },
      receipt_url: {
        type: Sequelize.STRING
      },
      metadata: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      refund_amount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      refund_reason: {
        type: Sequelize.STRING
      },
      refunded_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Create Reviews table
    await queryInterface.createTable('Reviews', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      ride_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Rides',
          key: 'id'
        }
      },
      reviewer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      reviewee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: {
        type: Sequelize.TEXT
      },
      category: {
        type: Sequelize.ENUM('driver', 'rider'),
        allowNull: false
      },
      tags: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      status: {
        type: Sequelize.ENUM('active', 'flagged', 'removed'),
        defaultValue: 'active'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Create Notifications table
    await queryInterface.createTable('Notifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.ENUM(
          'ride_request',
          'ride_accepted',
          'ride_cancelled',
          'ride_completed',
          'payment_received',
          'payment_failed',
          'driver_arrived',
          'promo_code',
          'system_alert'
        ),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      data: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      read_at: {
        type: Sequelize.DATE
      },
      delivery_status: {
        type: Sequelize.ENUM('pending', 'sent', 'failed'),
        defaultValue: 'pending'
      },
      delivery_channels: {
        type: Sequelize.JSON,
        defaultValue: ['push', 'email']
      },
      scheduled_for: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Create Locations table
    await queryInterface.createTable('Locations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('home', 'work', 'favorite', 'recent'),
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coordinates: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      metadata: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['phone_number']);
    await queryInterface.addIndex('Users', ['role']);
    await queryInterface.addIndex('Users', ['status']);

    await queryInterface.addIndex('Vehicles', ['driver_id']);
    await queryInterface.addIndex('Vehicles', ['license_plate']);
    await queryInterface.addIndex('Vehicles', ['status']);

    await queryInterface.addIndex('Rides', ['rider_id']);
    await queryInterface.addIndex('Rides', ['driver_id']);
    await queryInterface.addIndex('Rides', ['vehicle_id']);
    await queryInterface.addIndex('Rides', ['status']);
    await queryInterface.addIndex('Rides', ['scheduled_at']);
    await queryInterface.addIndex('Rides', ['payment_status']);

    await queryInterface.addIndex('Payments', ['ride_id']);
    await queryInterface.addIndex('Payments', ['user_id']);
    await queryInterface.addIndex('Payments', ['transaction_id']);
    await queryInterface.addIndex('Payments', ['status']);

    await queryInterface.addIndex('Reviews', ['ride_id']);
    await queryInterface.addIndex('Reviews', ['reviewer_id']);
    await queryInterface.addIndex('Reviews', ['reviewee_id']);
    await queryInterface.addIndex('Reviews', ['rating']);

    await queryInterface.addIndex('Notifications', ['user_id']);
    await queryInterface.addIndex('Notifications', ['type']);
    await queryInterface.addIndex('Notifications', ['is_read']);
    await queryInterface.addIndex('Notifications', ['delivery_status']);
    await queryInterface.addIndex('Notifications', ['scheduled_for']);

    await queryInterface.addIndex('Locations', ['user_id']);
    await queryInterface.addIndex('Locations', ['type']);
    await queryInterface.addIndex('Locations', ['is_default']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Locations');
    await queryInterface.dropTable('Notifications');
    await queryInterface.dropTable('Reviews');
    await queryInterface.dropTable('Payments');
    await queryInterface.dropTable('Rides');
    await queryInterface.dropTable('Vehicles');
    await queryInterface.dropTable('Users');
  }
}; 