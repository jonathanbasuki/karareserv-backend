const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.conf');

const Booking = sequelize.define('Booking', {
    booking_uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    user_uuid: {
        type: DataTypes.STRING(16),
        allowNull: false,
    },
    room_uuid: {
        type: DataTypes.UUID(),
        references: {
            model: 'rooms',
            key: 'room_uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    booking_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false,
    },
    booking_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
    },
}, {
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
});

Booking.associate = (models) => {
    Booking.belongsTo(models.Room, {
        foreignKey: 'room_uuid',
        as: 'room'
    });
};

module.exports = Booking;