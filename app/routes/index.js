const path = require('path'),
  router = require('express').Router(),
  _ = require('lodash');

var rooms = require('./room'),
  config = require(path.resolve('config')),
  Room = require(path.resolve('app/models/room'));

router.use('/rooms', rooms)

router.get('/offices', (req, res, next) => {
  Room.find().then((rooms) => {
    var offices = _.uniqBy(rooms, 'office').map((room) => room.office);
    res.json(offices)
  }).catch(next);
});

router.get('/offices/:office/rooms', (req, res, next) => {
  var officeName = req.params.office;
  return Room.find({office: officeName}).then((rooms) => {
    return res.json(rooms)
  }).catch(next);
});

router.get('/', (req, res) => res.send("App is running"));

module.exports = router;
