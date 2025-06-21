const bookingService = require('../services/Booking.service');

exports.createBooking = async (req, res) => {
    try {
        const result = await bookingService.createBooking(req.body);

        res.status(201).json({
            message: "Karaoke room booked successfully!",
            result
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const result = await bookingService.getAllBookings(req.body.user);

        res.status(200).json({
            message: "Booking list fetched successfully!",
            result
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookingDetail = async (req, res) => {
    try {
        const result = await bookingService.getBookingDetail(req.params.uuid);

        res.status(200).json({
            message: "Booking detail fetched successfully!",
            result
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const result = await bookingService.updateBooking(req.params.uuid, req.body);

        res.status(200).json({
            message: "Booking data updated successfully!",
            result
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const result = await bookingService.deleteBooking(req.params.uuid);

        res.status(200).json({
            message: "Booking data deleted successfully!",
            result
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};