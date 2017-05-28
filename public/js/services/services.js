'use strict';

angular.module('myApp').factory('Auth', ['$q', '$http', '$location', '$rootScope',
    function($q, $http, $location, $rootScope) {
        var authService = {};
        $rootScope.authUser = null;

        authService.requestUser = function() {
            var deferred = $q.defer();
            console.log("Requesting User");
            $http.get('/auth/user').success(function(user) {
                if (user) {
                    $rootScope.authUser = user;
                    $rootScope.authUser.createdAt = new Date(user.createdAt).toDateString();
                }

                deferred.resolve(user);
            }).error(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        authService.getUser = function() {
            return $rootScope.authUser;
        }

        authService.isLoggedIn = function() {
            return $rootScope.authUser != null;
        }

        authService.isAdmin = function() {
            return $rootScope.authUser.role == "admin";
        }

        authService.isUser = function() {
            return $rootScope.authUser.role == "user";
        }

        authService.login = function(creds) {
            var deferred = $q.defer();

            $http.post('/auth/login', creds).success(function(user) {
                if (user) {
                    $rootScope.authUser = user;
                    $location.path('/');
                    deferred.resolve(user);
                } else {
                    deferred.reject('Incorrect');
                }
            }).error(function(error) {
                deferred.reject("Incorrect Username or Password.");
            });

            return deferred.promise;
        }

        authService.signup = function(creds) {
            var deferred = $q.defer();

            if (creds.password != creds.repassword) {
                deferred.reject("Passwords do not match.");
                return deferred.promise;
            }

            if(creds.username.legnth < 3){
                deferred.reject("Username too short.");
                return deferred.promise;
            }

            if(creds.username.legnth > 8){
                deferred.reject("Username too long.");
                return deferred.promise;
            }

            $http.post('/auth/signup', creds).success(function(user) {
                if (user) {
                    $rootScope.authUser = user;
                    $location.path('/');
                    deferred.resolve(user);
                } else {
                    deferred.reject('Error Occurred');
                }
            }).error(function(error) {
                deferred.reject("Error Occurred.");
            });

            return deferred.promise;
        }

        authService.logout = function() {
            $rootScope.authUser = null;
            var deferred = $q.defer();

            $http.post('/auth/logout').success(function(user) {
                deferred.resolve(user);
            }).error(function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        return authService;
    }
]);