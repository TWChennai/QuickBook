var _ = require("lodash");
var defaults = require("./default.js");
var initialiseDB = require('./initialiseDb');

var config = require("./" + (process.env.NODE_ENV || "development") + ".js");

initialiseDB(config.db.url);

module.exports = _.merge({}, defaults, config);
