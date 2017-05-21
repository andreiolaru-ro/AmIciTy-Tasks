myApp.service('GmailService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

    var clientId = '';//TODO
    var apiKey = '';//TODO
    var scopes = 'https://www.googleapis.com/auth/gmail.readonly';
    var deferred = $q.defer();

    var emails = [];
    var addEmail = function (email) {
        emails.push(email)
    };

    this.login = function () {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: true
        }, this.handleAuthResult);
        return deferred.promise;
    };

    this.handleClientLoad = function () {
        gapi.client.setApiKey(apiKey);
        gapi.auth.init(function () {
        });
        window.setTimeout(checkAuth, 1);
    };

    this.checkAuth = function () {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: true
        }, this.handleAuthResult);
    };

    this.handleAuthResult = function (authResult) {
        if (authResult && !authResult.error) {
            var request = gapi.client.load('gmail', 'v1', displayInbox);

        } else {
            deferred.reject('error');
        }
    };

    function displayInbox() {
        var request = gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'labelIds': 'INBOX',
            'maxResults': 300
        });

        request.execute(function (response) {
            $.each(response.messages, function () {
                var messageRequest = gapi.client.gmail.users.messages.get({
                    'userId': 'me',
                    'id': this.id
                    //'format': 'raw'
                });
                messageRequest.execute(createMessageTemplate);
            });
        });
        deferred.resolve(emails);
    }

    function createMessageTemplate(message) {

        /*  var messageFrom = getHeader(message.payload.headers, 'From');
         var messageSubject = getHeader(message.payload.headers, 'Subject');
         var messageDate = getHeader(message.payload.headers, 'Date');

         var message = {
         from: messageFrom,
         subject: messageSubject,
         date: messageDate
         };*/

        var parsedMessage = parseMessage(message);
        addEmail(parsedMessage.textPlain);
    };

    function loadGmailApi() {
        gapi.client.load('gmail', 'v1', displayInbox);
    }

    this.handleAuthClick = function (event) {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: false,
            hd: domain
        }, this.handleAuthResult);
        return false;
    };

}]);