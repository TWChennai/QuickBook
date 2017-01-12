var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var path = require('path');
var configUtil = require('./configUtil');
var token;

function doAuthentication() {
    var clientSecret = process.env.client_secret;
    var clientId = process.env.client_id;
    var redirectUrl = process.env.redirect_uri;
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);


    if (!token) {
        oauth2Client.credentials = JSON.parse(configUtil.parseConfig(process.env.token));
        setToken(oauth2Client);
    } else {
        oauth2Client.credentials = JSON.parse(getToken());
        setToken(oauth2Client);
    }
}

function getNewToken(oauth2Client, callback) {
    oauth2Client.getToken(process.env.appCode, function (err, token) {
        if (err) {
            console.log('Error while trying to retrieve access token', err);
            return;
        }
        oauth2Client.credentials = token;
        callback(oauth2Client);
    });
}

function setToken(key) {
    token = key;
}

function getToken() {
    token.getAccessToken(function () {});
    return token;
}

module.exports = {
    getToken: getToken,
    doAuthentication: doAuthentication
};
