'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('room_images', {
      image_uuid: {
        type: Sequelize.STRING(16),
        primaryKey: true
      },
      room_uuid: {
        type: Sequelize.STRING(16),
        references: {
          model: 'rooms',
          key: 'room_uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      image_uri: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('room_images');
  }
};
