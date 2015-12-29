var myApp = angular.module('myApp', ['ngRoute', 'ngResource']);
myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'HomeController'
            })
            .when('/main', {
                templateUrl: 'templates/main.html',
                controller: 'MainController'
            })
            .otherwise({
                templateUrl: 'templates/home.html',
                controller: 'HomeController'
            });
    }]);