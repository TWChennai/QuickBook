var mongoose = require('mongoose');

module.exports = (url) => {
  mongoose.connect(url, {useMongoClient: true});
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  
  return db;
};
