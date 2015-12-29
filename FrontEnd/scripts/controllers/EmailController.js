myApp.controller('EmailController', ['$scope', '$http', function($scope, $http) {
    $scope.address = "";
    $scope.user = "";

    $scope.getEmail = function(){
        $http({url: 'http://localhost:10167/api/main/getEmail',
                method: 'GET',
                dataType:"json"
            }
        )
            .success(function(data){
                console.log(data);
                $scope.address = data["Address"];
                $scope.user = data["User"];
            })
            .error(function(err){
                console.log("error" + err);
            });
    };
    $scope.getEmail();
}]);