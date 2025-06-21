const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.conf');

const Payment = sequelize.define('Payment', {
    payment_uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    user_uuid: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    booking_uuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'card', 'qris'),
        allowNull: true
    },
    payment_status: {
        type: DataTypes.ENUM('paid', 'unpaid', 'refunded'),
        defaultValue: 'unpaid'
    }
}, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
});

Payment.associate = (models) => {
    Payment.belongsTo(models.Booking, {
        foreignKey: 'booking_uuid',
        as: 'booking',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

module.exports = Payment;