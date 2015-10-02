'use strict';

angular.module('myApp', ['ngRoute'])
    .config(function($routeProvider, $locationProvider){
        $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'AuthController'            
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'AuthController'           
        })
        .when('/todo', {
            templateUrl: 'views/todo.html',
            controller: 'ToDoController'           
        })
        .otherwise({
            redirectTo: '/'
        });
        $locationProvider.html5Mode(true);
    })
    .run(function(Auth, $rootScope, $location) {


        $rootScope.$watch('authUser', function(authUser) {
            if(!authUser){
                Auth.requestUser();
            }
        });
    });