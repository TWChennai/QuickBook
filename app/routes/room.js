const path = require('path'),
  router = require('express').Router();

let Room = require(path.resolve('app/models/room'));

router.get('/:room/status', function(req, res, next) {
  var roomName = req.params.room;
  Room.findOne({name: roomName}).then(function(room) {
    return room.getStatus(writeAsJson(res));
  }).catch(next);
});

router.post('/:room/book', function(req, res) {
  var roomName = req.params.room;
  Room.findOne({name: roomName}).then((room) => {

    room.createEvent(req.body, writeAsJson(res));
  })
});

router.post('/:room/end-quick-book-meeting', function(req, res) {
  var roomName = req.params.room;
  Room.findOne({name: roomName}).then((room) => {
    return room.deleteEvent(req.body.eventId, () => res.status(204).send({}));
  })
});

router.get('/', function(req, res) {
  Room.find().then(writeAsJson(res));
});

router.post('/create', (req, res) => {
  req.body.forEach((room) => new Room(room).save((err, fluffy) => err ? err : fluffy));
  res.json('ok');
});

var writeAsJson = function(res) {
  return function(data) {
    res.json(data);
  };
};

module.exports = router;
