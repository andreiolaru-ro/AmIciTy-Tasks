myApp.service('CalendarService', ['$http', '$rootScope',  '$q', function($http, $rootScope, $q) {
    var clientId = '';//TODO
    var apiKey = '';//TODO
    var scopes = 'https://www.googleapis.com/auth/calendar';
    var deferred = $q.defer();

    var calendarEvents = [];

    var addCalendarEvent = function(event)
    {
        calendarEvents.push(event)
    };

    /**
     * Check if current user has authorized this application.
     */
    this.checkAuth = function() {
        gapi.auth.authorize(
            {
                'client_id': clientId,
                'scope': scopes,
                'immediate': true
            }, this.handleAuthResult);
        return deferred.promise;
    };

    this.handleAuthResult = function(authResult) {
        if (authResult && !authResult.error) {
            gapi.client.load('calendar', 'v3', listUpcomingEvents);

        } else {
            deferred.reject("calendar error");
        }
    };

    this.handleAuthClick = function(event) {
        gapi.auth.authorize(
            {
                client_id: clientId,
                scope: scopes,
                immediate: true
            },
            handleAuthResult);
        return false;
    };

    function listUpcomingEvents() {
        var eventsDeffered = $q.defer();

        var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        });

        request.execute(function(resp) {
            var events = resp.items;
            if (events.length > 0) {
                for (i = 0; i < events.length; i++) {
                    var event = events[i];
                    var when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                    }
                   // console.log("event: " + event.summary + " date: " + when);
                }
                addCalendarEvent(events);
              //
            } else {
                console.log('No upcoming events found in calendar.');
            }
            eventsDeffered.resolve();
            deferred.resolve(calendarEvents[0]);
        });

        return eventsDeffered.promise;
    }

}]);