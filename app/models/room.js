var google = require('googleapis');
var moment = require('moment-timezone');
var token = require('../calender');
var jigsaw = require('./jigsaw');
var calendar = google.calendar('v3');
var configUtil = require('../configUtil');
var config = JSON.parse(configUtil.parseConfig(process.env.rooms));
var defaultOffice = process.env.defaultOffice;
var QuickBookCalendar = process.env.QuickBookCalendar;
var request = require('request');
var util = require('util');

moment.tz.setDefault("Asia/Kolkata");

function getStatus(room, callback) {
    calendar.events.list({
        auth: token.getToken(),
        calendarId: config[defaultOffice][room],
        timeMin: (new Date()).toISOString(),
        maxResults: 1,
        singleEvents: true,
        orderBy: 'startTime',
        timeZone: 'UTC+5:30'
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var events = response.items;
        if (events.length == 0) {
            console.log('No upcoming events found.');
            var randomBooking = {
                status: 'available',
                start: moment().add(1, 'day'),
                isQuickBookMeeting: false
            };
            callback(randomBooking)
        } else {
            var event = events[0];
            var start = event.start.dateTime || event.start.date;
            var end = event.end.dateTime || event.end.date;
            var isQuickBookMeeting = (event.organizer.email === QuickBookCalendar);
            var roomDetails = {
                creator: event.creator.email,
                summary: event.summary,
                eventId: event.id,
                organizerName: event.organizer.displayName,
                status: moment().isAfter(start) ? 'booked' : 'available',
                start: start,
                end: end,
                isQuickBookMeeting: isQuickBookMeeting
            };
            callback(roomDetails)
        }
    });
}

var constructCalendarEvent = function (empId, eventDetails, creatorMailId) {
    return {
        'summary': ''.concat('QuickBook Instant Meeting -  ', empId),
        'location': eventDetails.room,
        'description': 'Instant meeting booked with QuickBook',
        'start': {
            'dateTime': moment().format(),
            'timeZone': 'UTC+5:30'
        },
        'end': {
            'dateTime': moment().add(eventDetails.duration, 'minutes').format(),
            'timeZone': 'UTC+5:30'
        },
        'attendees': [
            {'email': config[defaultOffice][eventDetails.room]},
            {'email': creatorMailId}
        ],
        'reminders': {
            'useDefault': true
        }
    };
};


function createEvent(eventDetails, onEventCreated) {
    request(jigsaw.getPeopleUrl(eventDetails.employeeId), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            createEventIfValid(eventDetails, onEventCreated);
        }
        if (response.statusCode == 404) {
            onEventCreated({
                isValid: false,
                errors: {
                    employeeId: 'employee id not found'
                }
            })
        }
    })
}


var createEventIfValid = function (eventDetails, onSuccess) {
    var empId = eventDetails.employeeId;
    var creatorMailId = ''.concat(empId, '@', 'thoughtworks.com');
    var event = constructCalendarEvent(empId, eventDetails, creatorMailId);
    calendar.events.insert({
        auth: token.getToken(),
        calendarId: QuickBookCalendar,
        resource: event
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        var start = event.start.dateTime || event.start.date;
        var end = event.end.dateTime || event.end.date;
        var roomDetails = {
            summary: event.summary,
            creator: creatorMailId,
            eventId: event.id,
            status: moment().isAfter(start) ? 'booked' : 'available',
            start: start,
            end: end,
            isValid: true,
            isQuickBookMeeting: true
        };
        onSuccess(roomDetails);
    });
};


function deleteEvent(eventId, callback) {
    calendar.events.delete({
        auth: token.getToken(),
        calendarId: QuickBookCalendar,
        eventId: eventId
    }, function (err) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        callback();
    });

}

function getListOfRoomsInTheOffice(officeName, callback) {
    callback(Object.keys(config[officeName]));
}

module.exports = {
    getStatus: getStatus,
    createEvent: createEvent,
    deleteEvent: deleteEvent,
    getListOfRoomsInTheOffice: getListOfRoomsInTheOffice
};