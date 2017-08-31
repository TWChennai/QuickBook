const express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'), {IpFilter, IpDeniedError} = require('express-ipfilter'),
  cors = require('cors');

let config = require(path.resolve('config')),
  routes = require(path.resolve('app/routes')),
  whiteListedIps = config.whitelistedIps,
  app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(IpFilter(whiteListedIps, {
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
  if (app.get('env') === 'development')
    res.json({message: err.message, error: err});
  res.json({});
});

module.exports = app;
