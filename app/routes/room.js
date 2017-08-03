const path = require('path'),
  router = require('express').Router();
  
var room = require(path.resolve('app/models/room'));

router.get('/:room/status', function(req, res) {
  var roomName = req.params.room;
  room.getStatus(roomName, writeAsJson);
});

router.post('/:room/book', function(req, res) {
  room.createEvent(req.body, writeAsJson);
});

router.post('/:room/end-quick-book-meeting', function(req, res) {
  room.deleteEvent(req.body.eventId, () => res.status(204).send({}));
});

router.get('/', function(req, res) {
  var officeName = req.params.officeName;
  room.getListOfRoomsInTheOffice(officeName, writeAsJson);
});

var writeAsJson = function(data) {
  res.json(data)
};

module.exports = router;
