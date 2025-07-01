'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'deviceToken', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Firebase Cloud Messaging device token for push notifications'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'deviceToken');
  }
}; 