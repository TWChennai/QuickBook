var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var calender = require('./calender');
var cors = require('cors');
var ipfilter = require('express-ipfilter').IpFilter;
var IpDeniedError = require('express-ipfilter').IpDeniedError;
var configUtil = require('./configUtil');

var routes = require('./routes/rooms');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var whiteListedIpsAsString = process.env.whitelistedIps;
app.use(ipfilter(configUtil.parseAsArray(whiteListedIpsAsString), { mode: 'allow', allowedHeaders: ['x-forwarded-for'] }));

app.disable('etag');

app.use(function(req,res,next){
  //req.db = db;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    if (err instanceof IpDeniedError) {
      res.status(401);
    } else {
      res.status(err.status || 500);
    }
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  if(err instanceof IpDeniedError){
    res.status(401);
  } else {
    res.status(err.status || 500);
  }
  res.json({
    message: err.message,
    error: {}
  });
});

calender.doAuthentication();

module.exports = app;