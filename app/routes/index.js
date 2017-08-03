const path = require('path'),
  router = require('express').Router();

var rooms = require('./room'),
  config = require(path.resolve('config'))

router.use('/offices/:office/rooms', rooms)

router.get('/offices', (req, res) => res.json(config.offices));

router.get('/', (req, res) => res.send("App is running"));

module.exports = router;
