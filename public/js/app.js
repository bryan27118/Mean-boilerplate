'use strict';

angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'oc.lazyLoad'])
    .config(function($routeProvider, $locationProvider, $ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
        });
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
                    factory: checkRouting("user")
                }
            })
            .when('/verify', {
                templateUrl: 'views/verify.html',
                controller: 'VerificationController',
                resolve: {
                    factory: checkRouting("user")
                }
            })
            .when('/account', {
                templateUrl: 'views/account/index.html',
                controller: 'AccountController',
                resolve: {
                    factory: checkRouting("user")
                }
            })            
            .when('/admin', {
                templateUrl: 'views/admin/index.html',
                controller: 'AdminController',
                resolve: {
                    factory: checkRouting("admin"),
                    loadMyFiles: function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'myApp',
                            files: [
                                'js/directives/chat/chat.js',
                                'js/directives/dashboard/stats/stats.js'
                            ]
                        })
                    }
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

var checkRouting = function(reqRole) {
    return function($q, $rootScope, $location, $http) {
        if ($rootScope.authUser) {
            if ($rootScope.authUser.role == "admin" || $rootScope.authUser.role == reqRole) {
                return true;
            } else {
                $location.path("/login").search({
                    error: 'Insufficient permissions'
                });
                return false;
            }

        } else {
            var deferred = $q.defer();
            $http.get("/auth/user")
                .success(function(response) {
                    if (response) {
                        $rootScope.authUser = response;
                        $rootScope.authUser.createdAt = new Date($rootScope.authUser.createdAt).toDateString();
                        if ($rootScope.authUser.role == "admin" || $rootScope.authUser.role == reqRole) {
                            deferred.resolve(true);
                        } else {
                            deferred.reject();
                            $location.path("/login").search({
                                error: 'Insufficient permissions'
                            });
                        }
                    } else {
                        deferred.reject();
                        $location.path("/login").search({
                            error: 'You must login to view that page.'
                        });
                    }
                })
                .error(function() {
                    deferred.reject();
                    $location.path("/login").search({
                        error: 'You must login to view that page.'
                    });;
                });
            return deferred.promise;
        }
    };
};