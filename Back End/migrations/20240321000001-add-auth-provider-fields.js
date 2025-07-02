'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'auth_provider', {
      type: Sequelize.ENUM('email', 'google', 'phone'),
      defaultValue: 'email',
      allowNull: false,
      comment: 'Authentication provider used by the user'
    });

    await queryInterface.addColumn('users', 'google_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'Google OAuth ID for users who signed up with Google'
    });

    await queryInterface.addColumn('users', 'profile_picture', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL to user profile picture'
    });

    // Make email and password nullable for phone-only users
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    });

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('users', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Add indexes for new fields
    await queryInterface.addIndex('users', ['auth_provider']);
    await queryInterface.addIndex('users', ['google_id']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex('users', ['auth_provider']);
    await queryInterface.removeIndex('users', ['google_id']);

    // Remove columns
    await queryInterface.removeColumn('users', 'auth_provider');
    await queryInterface.removeColumn('users', 'google_id');
    await queryInterface.removeColumn('users', 'profile_picture');

    // Restore original constraints
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    });

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('users', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  }
}; 