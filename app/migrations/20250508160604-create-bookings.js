'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      booking_uuid: {
        type: Sequelize.UUID(),
        primaryKey: true,
        defaultValue: Sequelize.literal('UUID()'),
      },
      user_uuid: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      room_uuid: {
        type: Sequelize.UUID(),
        references: {
          model: 'rooms',
          key: 'room_uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      booking_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      total_price: {
        type: Sequelize.DECIMAL(13, 2),
        allowNull: false,
      },
      booking_status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  }
};
