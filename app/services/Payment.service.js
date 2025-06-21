const { Payment, Booking, Room } = require('../models');

exports.updatePaymentStatus = async (booking_uuid, data) => {
    const { payment_method, payment_status } = data;

    const payment = await Payment.findOne({
        attributes: ['payment_uuid', 'user_uuid', 'booking_uuid', 'payment_date', 'amount', 'payment_method', 'payment_status', 'updated_at'],
        where: { booking_uuid }
    });
    if (!payment) throw new Error('Payment not found');

    const booking = await Booking.findOne({ where: { booking_uuid } });
    if (!booking) throw new Error('Booking not found');

    const isPaid = payment_status === 'paid';

    await payment.update({
        payment_method: payment_method || payment.payment_method,
        payment_status: isPaid ? 'paid' : (payment_status || payment.payment_status),
        payment_date: isPaid ? new Date() : payment.payment_date
    });

    if (isPaid) {
        await booking.update({ booking_status: 'confirmed' });
    }

    return payment;
};

exports.getAllPayments = async (user) => {
    const payments = await Payment.findAll({
        attributes: ['payment_uuid', 'booking_uuid', 'payment_date', 'amount', 'payment_method', 'payment_status'],
        where: {
            user_uuid: user
        },
        include: [
            {
                model: Booking,
                as: 'booking',
                attributes: ['booking_uuid', 'room_uuid', 'booking_date', 'start_time', 'end_time', 'booking_status'],
                include: [
                    {
                        model: Room,
                        as: 'room',
                        attributes: ['room_type']
                    }
                ]
            }
        ],
        order: [['payment_date', 'DESC']]
    });

    return payments.map(payment => {
        const plain = payment.get({ plain: true });
        return {
            payment_uuid: plain.payment_uuid,
            booking_uuid: plain.booking_uuid,
            payment_date: plain.payment_date,
            amount: plain.amount,
            payment_method: plain.payment_method,
            payment_status: plain.payment_status,
            booking_date: plain.booking?.booking_date || null,
            start_time: plain.booking?.start_time || null,
            end_time: plain.booking?.end_time || null,
            booking_status: plain.booking?.booking_status || null,
            room_type: plain.booking?.room?.room_type || null
        };
    });
};