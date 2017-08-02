var express = require('express');
var router = express.Router();
const path = require('path');
var room = require(path.resolve('app/models/room'));
var config = require(path.resolve('config'))

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
  res.json(config.offices);
});

router.get('/', function(req, res) {
  res.send("App is running");
});

module.exports = router;
