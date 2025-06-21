const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/db.conf');
const fs = require('fs');
const path = require('path');

const { Room, RoomImage } = require('../models');

exports.getAllRoomsWithPreviewImage = async () => {
    const rooms = await Room.findAll({
        include: [
            {
                model: RoomImage,
                as: 'images',
                attributes: ['image_uri'],
                limit: 1,
                separate: true
            }
        ]
    });

    return rooms.map(room => {
        const roomJson = room.toJSON();
        return {
            room_uuid: roomJson.room_uuid,
            room_type: roomJson.room_type,
            room_capacity: roomJson.room_capacity,
            image: roomJson.images[0]?.image_uri || null
        };
    });
};

exports.getRoomWithImages = async (room_uuid) => {
    const room = await Room.findOne({
        where: { room_uuid },
        include: [
            {
                model: RoomImage,
                as: 'images',
                attributes: ['image_uri']
            }
        ]
    });

    if (!room) throw new Error('Room not found');

    const formattedRoom = {
        ...room.toJSON(),
        images: room.images.map(img => img.image_uri)
    };

    return formattedRoom;
};

exports.addRoomWithImages = async (roomData, files) => {
    const t = await sequelize.transaction();

    try {
        const room_uuid = uuidv4();

        const room = await Room.create({
            room_uuid,
            ...roomData
        }, { transaction: t });

        const images = files.map(file => ({
            image_uuid: uuidv4(),
            room_uuid,
            image_uri: `/uploads/${file.filename}`
        }));

        await RoomImage.bulkCreate(images, { transaction: t });

        await t.commit();

        return { room, images };
    } catch (err) {
        await t.rollback();

        throw err;
    }
}

exports.deleteRoomWithImages = async (room_uuid) => {
    const t = await sequelize.transaction();

    try {
        const images = await RoomImage.findAll({
            where: { room_uuid },
            transaction: t
        });

        images.forEach(image => {
            const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', path.basename(image.image_uri));

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        await RoomImage.destroy({ where: { room_uuid }, transaction: t });

        const deleted = await Room.destroy({ where: { room_uuid }, transaction: t });

        if (deleted === 0) throw new Error('Room not found');

        await t.commit();

        return { message: 'Room and associated images deleted successfully' };
    } catch (err) {
        await t.rollback();

        throw err;
    }
};