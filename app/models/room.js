const path = require('path'),
  googleCalendar = require('googleapis').calendar,
  moment = require('moment-timezone'),
  mongoose = require('mongoose'),
  request = require('request');

let token = require(path.resolve('app/models/googleToken')),
  calendar = googleCalendar('v3'),
  jigsaw = require(path.resolve('app/models/jigsaw'));

let {QuickBookCalendar} = require(path.resolve('config'));

mongoose.Promise = global.Promise;

var roomSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  calendarId: String,
  office: String,
  images: {
    booked_url: String,
    available_url: String
  }
});

roomSchema.methods.getStatus = function(callback) {
  let calendarId = this.calendarId;
  var self = this;
  calendar.events.list({
    auth: token.getToken(),
    calendarId: calendarId,
    timeMin: (new Date()).toISOString(),
    maxResults: 1,
    singleEvents: true,
    orderBy: 'startTime',
    timeZone: 'UTC+5:30'
  }, function(err, response) {
    if (err) {
      if(err.code == 401){
        token.refreshAccessToken();
        return self.getStatus(callback);
      }
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

roomSchema.methods.constructCalendarEvent = function(empId, duration, creatorMailId) {
  let calendarId = this.calendarId;
  let room = this.name;
  return {
    'summary': ''.concat('QuickBook Instant Meeting -  ', empId),
    'location': room,
    'description': 'Instant meeting booked with QuickBook',
    'start': {
      'dateTime': moment().format(),
      'timeZone': 'UTC+5:30'
    },
    'end': {
      'dateTime': moment().add(duration, 'minutes').format(),
      'timeZone': 'UTC+5:30'
    },
    'attendees': [
      {
        'email': calendarId
      }, {
        'email': creatorMailId
      }
    ],
    'reminders': {
      'useDefault': true
    }
  };
}

roomSchema.methods.createEventIfValid = function(eventDetails, onSuccess) {
  var {employeeId, duration} = eventDetails;
  var creatorMailId = ''.concat(employeeId, '@', 'thoughtworks.com');
  var event = this.constructCalendarEvent(employeeId, duration, creatorMailId);
  calendar.events.insert({
    auth: token.getToken(),
    calendarId: QuickBookCalendar,
    resource: event
  }, function(err, event) {
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
      status: moment().isAfter(start)
        ? 'booked'
        : 'available',
      start: start,
      end: end,
      isValid: true,
      isQuickBookMeeting: true
    };
    onSuccess(roomDetails);
  });
}

roomSchema.methods.createEvent = function(eventDetails, onEventCreated) {
  var self = this;
  request(jigsaw.getPeopleUrl(eventDetails.employeeId), function(error, response, body) {
    if (!error && response.statusCode == 200) {
      self.createEventIfValid(eventDetails, onEventCreated);
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

roomSchema.methods.deleteEvent = function(eventId, callback) {
  calendar.events.delete({
    auth: token.getToken(),
    calendarId: QuickBookCalendar,
    eventId: eventId
  }, function(err) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    callback();
  });
}

module.exports = mongoose.model('Room', roomSchema);
