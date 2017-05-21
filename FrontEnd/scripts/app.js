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
            .when('/github', {
                templateUrl: 'templates/connectors/github.html',
                controller: 'Github'
            })
            .when('/github/repos', {
                templateUrl: 'templates/connectors/repositories.html',
                controller: 'Repositories'
            })
            .when('/gmail', {
                templateUrl: 'templates/connectors/gmail.html',
                controller: 'GmailController'
            })
            .when('/test', {
                templateUrl: 'templates/test.html',
                controller: 'TestController'
            })
            .otherwise({
                templateUrl: 'templates/connectors/gmailPreview.html',
                controller: 'Gmail'
            });
    }]);