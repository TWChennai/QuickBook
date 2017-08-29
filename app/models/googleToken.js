const google = require('googleapis'),
  googleAuth = require('google-auth-library'),
  path = require('path'),
  config = require(path.resolve('config'));

class GoogleToken {
  constructor(token) {
    this.token = token
  }

  _getNewToken(oauth2Client, callback) {
    oauth2Client.getToken(config.google.appCode, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = this.token;
      callback(oauth2Client);
    });
  }

  getToken() {
    this.token.getAccessToken(function() {});
    return this.token;
  }

  refreshAccessToken() {
    this.token.refreshAccessToken(() => {});
  }
}

var doAuthentication = function() {
  var clientSecret = config.google.client_secret;
  var clientId = config.google.client_id;
  var redirectUrl = config.google.redirect_uri;
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  oauth2Client.credentials = config.google.token;
  return new GoogleToken(oauth2Client)
};

module.exports = doAuthentication();
