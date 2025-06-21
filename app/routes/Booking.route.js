const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/Booking.controller');

router.get('/booking', bookingController.getAllBookings);
router.get('/booking/:uuid', bookingController.getBookingDetail);
router.post('/booking', bookingController.createBooking);
router.put('/booking/:uuid', bookingController.updateBooking);
router.delete('/booking/:uuid', bookingController.deleteBooking);

module.exports = router;