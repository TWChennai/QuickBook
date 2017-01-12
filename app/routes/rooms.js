var express = require('express');
var router = express.Router();
var room = require('../models/room');
var configUtil = require('../configUtil.js');

router.get('/:room/status', function(req, res) {

  function writeAsJson(status){
    res.json(status)
  }

  var roomName = req.params.room;
  room.getStatus(roomName, writeAsJson);
});

router.post('/book', function(req, res) {

  function writeAsJson(status){
    res.json(status)
  }

  room.createEvent(req.body, writeAsJson);
});

router.post('/end-quick-book-meeting', function(req, res) {

  function writeAsJson(){
      res.status(204).send({});
  }

  room.deleteEvent(req.body.eventId, writeAsJson);
});

router.get('/:officeName/rooms', function (req, res) {

  function writeAsJson(roomList) {
    res.json(roomList)
  }
  var officeName = req.params.officeName;
  room.getListOfRoomsInTheOffice(officeName, writeAsJson);
});

router.get('/offices', function (req, res) {
  res.json(configUtil.parseAsArray(process.env.offices));
});

router.get('/', function(req, res) {
  res.send("App is running");
});

module.exports = router;
