myApp.controller('TaskController', ['$scope', '$http', function($scope, $http) {

    $scope.getTask = function(){
        $http({url: 'http://localhost:10167/api/main/getTask',
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
    $scope.getTask();
}]);