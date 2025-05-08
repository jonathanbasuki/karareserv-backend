'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      payment_uuid: {
        type: Sequelize.STRING(16),
        primaryKey: true,
      },
      user_uuid: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      booking_uuid: {
        type: Sequelize.STRING(16),
        references: {
          model: 'bookings',
          key: 'booking_uuid',
        },
        payment_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        amount: {
          type: Sequelize.DECIMAL(13, 2),
          allowNull: false,
        },
        payment_method: {
          type: Sequelize.ENUM('cash', 'card', 'qris'),
          allowNull: false,
        },
        payment_status: {
          type: Sequelize.ENUM('paid', 'unpaid', 'refunded'),
          defaultValue: 'unpaid',
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
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};
