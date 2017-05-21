myApp.controller('Repositories', ['$scope', '$http', 'GitHubService', function($scope, $http,GitHubService){
    $scope.repositories = {};
    GitHubService.getRepositories().then(function(data) {
            $scope.repositories = data;
            console.log('albums returned to controller.' + data[0]);
        },
        function(error) {
            console.log('albums retrieval failed.')
        });

}]);