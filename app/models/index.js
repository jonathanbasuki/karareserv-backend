const db = {};

db.Room = require('./Room.model');
db.RoomImage = require('./RoomImage.model');
db.Booking = require('./Booking.model')
db.Payment = require('./Payment.model')

// Setup associations
if (db.Room.associate) db.Room.associate(db);
if (db.RoomImage.associate) db.RoomImage.associate(db);
if (db.Booking.associate) db.Booking.associate(db);
if (db.Payment.associate) db.Payment.associate(db);

module.exports = db;