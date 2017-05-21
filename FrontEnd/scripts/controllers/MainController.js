myApp.controller('MainController', ['$scope', '$http', 'GmailService', 'CalendarService', 'GitHubService',
    function ($scope, $http, GmailService, CalendarService, GitHubService) {
        $scope.calendarEvents = null;
        $scope.emails = null;
        $scope.githubUserProfile = null;
        $scope.repositories = {};
        $scope.clusteredItems = [];
        $scope.githubIssues = [];

        CalendarService.checkAuth().then(
            function (events) {
                $scope.calendarEvents = events;
            }, function (err) {
                console.log("Failed in retrieving calendar events " + err);
            }
        );

        GmailService.login().then(
            function (emails) {
                $scope.emails = emails;
            }, function (err) {
                console.log('Failed getting gmail: ' + err);
            });

        $scope.cluster = function () {
            console.log("calendar events length: " + $scope.calendarEvents.length);
            console.log("emails length: " + $scope.emails.length);
            console.log('repos length: ' + $scope.repositories.length);
            console.log('issues length: ' + $scope.githubIssues[0].length);

            //console.log(JSON.stringify($scope.clusteredItems));
        };

        GitHubService.getProfile().then(
            function (data) {
                $scope.githubUserProfile = data;
                GitHubService.getRepositories().then(
                    function (repos) {
                        $scope.repositories = repos;
                        GitHubService.createOpenIssuesList($scope.githubIssues);
                        console.log($scope.githubIssues[0]);
                    },function (error) {
                        console.log('repos retrieval failed.')
                    })
            },  function (error) {
            });

    }]);