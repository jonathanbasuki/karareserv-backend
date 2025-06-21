const express = require('express');
const router = express.Router();

const upload = require('../middlewares/uploadImage');

const roomController = require('../controllers/Room.controller');

router.get('/room', roomController.getAllRooms);
router.get('/room/:uuid', roomController.getRoomDetails);
router.post('/room', upload.array('images', 5), roomController.addKaraokeRoom);
router.delete('/room/:uuid', roomController.deleteKaraokeRoom);

module.exports = router;