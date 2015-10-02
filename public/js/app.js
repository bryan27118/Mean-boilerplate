'use strict';

angular.module('myApp', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
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
                controller: 'ToDoController',
                resolve: {
                    factory: checkRouting
                }
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    })
    .run(function(Auth, $rootScope, $location) {


        $rootScope.$watch('authUser', function(authUser) {
            if (!authUser) {
                Auth.requestUser();
            }
        });
    });

var checkRouting= function ($q, $rootScope, $location, $http) {
    if ($rootScope.authUser) {
        return true;
    } else {
        var deferred = $q.defer();
        $http.post("/api/user")
            .success(function (response) {
                if(response){
                    $rootScope.authUser = response;
                    deferred.resolve(true);
                }else{
                    deferred.reject();
                    $location.path("/login").search({error: 'You must login to view that page.'});
                }
            })
            .error(function () {
                deferred.reject();
                $location.path("/login").search({error: 'You must login to view that page.'});;
             });
        return deferred.promise;
    }
};