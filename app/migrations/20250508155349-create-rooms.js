'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      room_uuid: {
        type: Sequelize.UUID(),
        primaryKey: true,
        defaultValue: Sequelize.literal('UUID()'),
      },
      room_number: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      room_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      room_capacity: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      room_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      room_status: {
        type: Sequelize.ENUM('available', 'maintenance'),
        defaultValue: 'available',
      },
      hourly_rate: {
        type: Sequelize.DECIMAL(13, 2),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms');
  }
};
