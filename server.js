require('dotenv').config();

const express = require('express');
const app = express();
const db = require('./app/models');

app.use(express.json());

const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected');
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error('❌ Database connection error: ', err));
