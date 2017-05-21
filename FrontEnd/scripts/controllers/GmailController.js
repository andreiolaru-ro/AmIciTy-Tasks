myApp.controller('GmailController', ['$scope', '$http', 'GmailService', function($scope, $http, GmailService){
    $scope.emails = [];

    GmailService.login().then(
        function (data) {
            $scope.emails.push(data);
            console.log("length: " + data.length);
        }, function (err) {
            console.log('Failed: ' + err);
        });

}]);