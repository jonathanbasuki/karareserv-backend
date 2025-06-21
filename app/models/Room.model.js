const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.conf');

const Room = sequelize.define('Room', {
    room_uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    room_number: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    room_type: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    room_capacity: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    room_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    room_status: {
        type: DataTypes.ENUM('available', 'maintenance'),
        defaultValue: 'available'
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(13, 2),
        allowNull: false
    }
}, {
    tableName: 'rooms',
    timestamps: false
});

Room.associate = (models) => {
    Room.hasMany(models.RoomImage, {
        foreignKey: 'room_uuid',
        as: 'images'
    });

    Room.hasMany(models.Booking, {
        foreignKey: 'room_uuid',
        as: 'bookings',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

module.exports = Room;
