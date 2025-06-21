require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./app/config/db.conf');

const PORT = process.env.PORT || 3000;

const roomRoutes = require('./app/routes/Room.route');

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(roomRoutes);

db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected');
        app.listen(PORT, () => console.log(`🚀 Server running on ${process.env.BASE_URL}`));
    })
    .catch(err => console.error('❌ Database connection error: ', err));
