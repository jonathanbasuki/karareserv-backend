const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.conf');

const RoomImage = sequelize.define('RoomImage', {
    image_uuid: {
        type: DataTypes.UUID(),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    room_uuid: {
        type: DataTypes.UUID(),
        references: {
            model: 'rooms',
            key: 'room_uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    image_uri: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'room_images',
    timestamps: false,
});

RoomImage.associate = (models) => {
    RoomImage.belongsTo(models.Room, {
        foreignKey: 'room_uuid',
        as: 'room',
    });
};

module.exports = RoomImage;