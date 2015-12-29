myApp.controller('ForumController', ['$scope', '$http', function($scope, $http) {

    $scope.getForum = function(){
        $http({url: 'http://localhost:10167/api/main/getForum',
                method: 'GET',
                dataType:"json"
            }
        )
            .success(function(data){
                console.log(data);
            })
            .error(function(err){
                console.log("error" + err);
            });
    };
    $scope.getForum();
}]);