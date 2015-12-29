myApp.controller('RSSController', ['$scope', '$http', function($scope, $http) {

    $scope.getRSS = function(){
        $http({url: 'http://localhost:10167/api/main/getRSS',
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
    $scope.getRSS();
}]);