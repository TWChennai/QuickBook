const express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  ipfilter = require('express-ipfilter').IpFilter,
  IpDeniedError = require('express-ipfilter').IpDeniedError;

let calender = require(path.resolve('app/calender')),
  config = require(path.resolve('config')),
  routes = require(path.resolve('app/routes')),
  whiteListedIps = config.whitelistedIps,
  app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(ipfilter(whiteListedIps, {
  mode: 'allow',
  allowedHeaders: ['x-forwarded-for']
}));

app.disable('etag');

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  if (err instanceof IpDeniedError) {
    res.status(401);
  } else {
    res.status(err.status || 500);
  }
  res.json({
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});

module.exports = app;
