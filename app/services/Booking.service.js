const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/db.conf');

const { Room, Booking } = require('../models');

exports.createBooking = async (data) => {
    const { room_uuid, start_time, end_time, booking_date, user_uuid } = data;

    const room = await Room.findOne({ where: { room_uuid } });

    if (!room) throw new Error('Room not found');

    const start = new Date(`${booking_date}T${start_time}`);
    const end = new Date(`${booking_date}T${end_time}`);

    const durationInHours = (end - start) / (1000 * 60 * 60);

    if (durationInHours <= 0) throw new Error('End time must be after start time');

    const total_price = parseFloat(room.hourly_rate) * durationInHours;

    const newBooking = await Booking.create({
        booking_uuid: uuidv4(),
        user_uuid,
        room_uuid,
        booking_date,
        start_time,
        end_time,
        total_price,
        booking_status: 'pending'
    });

    return newBooking;
};

exports.getAllBookings = async (user) => {
    return await Booking.findAll({
        attributes: ['booking_uuid', 'room_uuid', 'booking_date', 'start_time', 'end_time'],
        where: { user_uuid: user },
        include: [{
            model: Room,
            as: 'room',
            attributes: ['room_uuid', 'room_number', 'room_type', 'room_capacity']
        }],
    });
};

exports.getBookingDetail = async (uuid) => {
    const booking = await Booking.findOne({
        where: { booking_uuid: uuid },
        include: [{ model: Room, as: 'room' }]
    });

    if (!booking) throw new Error('Booking not found');

    return booking;
};

exports.updateBooking = async (uuid, data) => {
    const booking = await Booking.findByPk(uuid);

    if (!booking) throw new Error('Booking not found');

    if (booking.booking_status !== 'pending') {
        throw new Error('Only pending bookings can be updated');
    }

    const updatedFields = {
        ...data
    };

    const shouldRecalculate = data.start_time || data.end_time || data.booking_date;

    if (shouldRecalculate) {
        const roomUuid = data.room_uuid || booking.room_uuid;
        const room = await Room.findOne({ where: { room_uuid: roomUuid } });

        if (!room) throw new Error('Room not found');

        const bookingDate = data.booking_date || booking.booking_date;
        const startTime = data.start_time || booking.start_time;
        const endTime = data.end_time || booking.end_time;

        const start = new Date(`${bookingDate}T${startTime}`);
        const end = new Date(`${bookingDate}T${endTime}`);

        const durationInHours = (end - start) / (1000 * 60 * 60);
        if (durationInHours <= 0) throw new Error('End time must be after start time');

        updatedFields.total_price = parseFloat(room.hourly_rate) * durationInHours;
    }

    await booking.update(updatedFields);

    return booking;
};

exports.deleteBooking = async (uuid) => {
    const booking = await Booking.findByPk(uuid);

    if (!booking) throw new Error('Booking not found');

    if (booking.booking_status === 'confirmed') {
        throw new Error('Confirmed bookings cannot be deleted');
    }

    await booking.destroy();

    return { message: 'Booking deleted (soft) successfully' };
};