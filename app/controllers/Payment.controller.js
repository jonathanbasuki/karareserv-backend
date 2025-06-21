const paymentService = require('../services/Payment.service');

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { booking_uuid } = req.params;
        const result = await paymentService.updatePaymentStatus(booking_uuid, req.body);

        res.status(200).json({
            message: "Payment confirmed successfully!",
            result
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const result = await paymentService.getAllPayments(req.body.user);

        res.status(200).json({
            message: "Payment data fetched successfully!",
            result
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};