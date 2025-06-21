require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./app/config/db.conf');

const PORT = process.env.PORT || 3000;

const roomRoute = require('./app/routes/Room.route');
const bookingRoute = require('./app/routes/Booking.route');

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(roomRoute);
app.use(bookingRoute);

db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected');
        app.listen(PORT, () => console.log(`🚀 Server running on ${process.env.BASE_URL}`));
    })
    .catch(err => console.error('❌ Database connection error: ', err));
