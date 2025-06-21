const roomService = require('../services/Room.service');

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await roomService.getAllRoomsWithPreviewImage();

        res.status(200).json({
            message: "Room list fetched successfully!",
            rooms
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

exports.getRoomDetails = async (req, res) => {
    try {
        const room = await roomService.getRoomWithImages(req.params.uuid);

        res.status(200).json({
            message: "Room details fetched successfully!",
            details: room
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.addKaraokeRoom = async (req, res) => {
    try {
        const roomData = {
            room_number: req.body.room_number,
            room_type: req.body.room_type,
            room_capacity: req.body.room_capacity,
            room_description: req.body.room_description,
            room_status: req.body.room_status || 'available',
            hourly_rate: req.body.hourly_rate
        };

        const result = await roomService.addRoomWithImages(roomData, req.files);

        res.status(201).json({
            message: 'Room created successfully!',
            room: result.room,
            images: result.images
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create room with images!' });
    }
};

exports.deleteKaraokeRoom = async (req, res) => {
    try {
        const result = await roomService.deleteRoomWithImages(req.params.uuid);

        res.status(200).json({
            message: 'Room and associated images deleted successfully!',
            result,
        });
    } catch (err) {
        console.error('❌ Delete Room Error:', err.message);

        res.status(404).json({ error: err.message });
    }
};