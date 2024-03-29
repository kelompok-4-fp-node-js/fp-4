  'use strict';
  module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.createTable('user', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        full_name: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING,
          unique: true
        },
        username: {
          type: Sequelize.STRING,
          unique: true
        },
        password: {
          type: Sequelize.STRING
        },
        profile_image_url: {
          type: Sequelize.TEXT
        },
        age: {
          type: Sequelize.INTEGER
        },
        phone_number: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    },
    async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('user');
    }
  };
