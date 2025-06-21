const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/Payment.controller');

router.get('/payment', paymentController.getAllPayments);
router.put('/payment/:booking_uuid', paymentController.updatePaymentStatus);

module.exports = router;