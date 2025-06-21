const db = {};

db.Room = require('./Room.model');
db.RoomImage = require('./RoomImage.model');

// Setup associations
if (db.Room.associate) db.Room.associate(db);
if (db.RoomImage.associate) db.RoomImage.associate(db);

module.exports = db;