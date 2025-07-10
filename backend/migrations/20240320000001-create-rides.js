'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rides', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      riderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      driverId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      origin: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      },
      destination: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED'),
        defaultValue: 'PENDING'
      },
      fare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      distance: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      estimatedDuration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      paymentStatus: {
        type: Sequelize.ENUM('PENDING', 'COMPLETED', 'FAILED'),
        defaultValue: 'PENDING'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('rides', ['riderId']);
    await queryInterface.addIndex('rides', ['driverId']);
    await queryInterface.addIndex('rides', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rides');
  }
}; 