myApp.controller('CalendarController', ['$scope', '$http', function($scope, $http) {

    $scope.getCalendar = function(){
        $http({url: 'http://localhost:10167/api/main/getCalendar',
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
    $scope.getCalendar();
}]);