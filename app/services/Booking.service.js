const { v4: uuidv4 } = require('uuid');

const { Room, Booking, Payment } = require('../models');

exports.createBooking = async (data) => {
    const { room_uuid, start_time, end_time, booking_date, user_uuid, payment_method = 'cash' } = data;

    const room = await Room.findOne({ where: { room_uuid } });

    if (!room) throw new Error('Room not found');

    const start = new Date(`${booking_date}T${start_time}`);
    const end = new Date(`${booking_date}T${end_time}`);

    const durationInHours = (end - start) / (1000 * 60 * 60);

    if (durationInHours <= 0) throw new Error('End time must be after start time');

    const total_price = parseFloat(room.hourly_rate) * durationInHours;

    const booking = await Booking.create({
        booking_uuid: uuidv4(),
        user_uuid,
        room_uuid,
        booking_date,
        start_time,
        end_time,
        total_price,
        booking_status: 'pending'
    });

    await Payment.create({
        payment_uuid: uuidv4(),
        user_uuid,
        booking_uuid: booking.booking_uuid,
        amount: total_price,
        payment_status: 'unpaid'
    });

    return booking;
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

    const updatedFields = { ...data };

    let newTotalPrice = booking.total_price;

    const shouldRecalculate =
        data.start_time || data.end_time || data.booking_date || data.room_uuid;

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

        newTotalPrice = parseFloat(room.hourly_rate) * durationInHours;
        updatedFields.total_price = newTotalPrice;
    }

    await booking.update(updatedFields);

    const payment = await Payment.findOne({ where: { booking_uuid: booking.booking_uuid } });
    if (payment) {
        await payment.update({ amount: newTotalPrice });
    }

    return booking;
};

exports.deleteBooking = async (uuid) => {
    const booking = await Booking.findByPk(uuid);
    const payment = await Payment.findOne({ where: { booking_uuid: uuid } });

    if (!booking) throw new Error('Booking not found');
    if (!payment) throw new Error('Payment not found');

    if (booking.booking_status === 'confirmed') {
        throw new Error('Confirmed bookings cannot be deleted');
    }

    await payment.destroy();

    await booking.update({ booking_status: 'cancelled' });

    return { message: 'Booking canceled successfully' };
};