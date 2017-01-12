var request = require('request');
var util = require('util');

var baseUrl = 'https://jigsaw.thoughtworks.net/api';


function getPeopleUrl(id) {
    var peopleUrl = util.format('%s/people/%s', baseUrl, id);

    return {
        url: peopleUrl,
        headers: {
            Authorization: process.env.authorizationCode
        }
    };

}

module.exports = {
    getPeopleUrl: getPeopleUrl
};