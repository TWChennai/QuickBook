var request = require('request');
var util = require('util');
const path = require('path');
var {jigsaw} = require(path.resolve('config'));

var baseUrl = 'https://jigsaw.thoughtworks.net/api';

function getPeopleUrl(id) {
  var peopleUrl = util.format('%s/people/%s', baseUrl, id);
  return {
    url: peopleUrl,
    headers: {
      Authorization: jigsaw.authorizationCode
    }
  };
}

module.exports = {
  getPeopleUrl: getPeopleUrl
};
