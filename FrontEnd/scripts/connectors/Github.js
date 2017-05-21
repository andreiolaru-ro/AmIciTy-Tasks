myApp.controller('Github', ['$scope', '$http', '$location', 'GitHubService', function($scope, $http, $location, GitHubService){
    $scope.getRepositories = function()
    {
        var repoURL = $scope.data["repos_url"];
        $http({
            url: repoURL,
            method:'GET'
            })
            .success(function (repos) {
                $scope.repositories = repos;
                $location.path("/github/repos");
            })
            .error(function(repos){
                console.log("get error");
            });
    };

   GitHubService.getProfile()
       .then(function(data) {
           $scope.data = data;
        },
        function(error) {
        });

}]);