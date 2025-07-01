'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_preferences', 'sms_notifications');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_preferences', 'sms_notifications', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  }
}; 