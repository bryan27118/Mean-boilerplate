'use strict';

var app = angular.module('myApp');

app.controller('AuthController', ['$scope', '$location', 'Auth', '$routeParams',
    function($scope, $location, Auth, $routeParams) {
        $scope.loginError = $routeParams.error;
        $scope.user = {};
        $scope.dataLoading = false;

        $scope.login = function() {
            $scope.loginError = "";
            $scope.dataLoading = true;
            var promise = Auth.login($scope.user);
            promise.then(function(status) { //Success
                $scope.dataLoading = false;
                $location.path("/");
            }, function(status) { //Failed
                $scope.dataLoading = false;
                $scope.loginError = status;
            });
        }

        $scope.signup = function() {
            $scope.loginError = "";
            $scope.dataLoading = true;
            var promise = Auth.signup($scope.user);
            promise.then(function(status) { //Success
                $scope.dataLoading = false;
                $location.path("/");
            }, function(status) { //Failed
                $scope.dataLoading = false;
                $scope.loginError = status;
            });
        }

        $scope.logout = function() {
            var promise = Auth.logout();
            promise.then(function(status) { //Success
                $location.path($location.path());
            }, function(status) { //Failed

            });
        }

    }
]);

app.controller('NavbarController', ['$scope', '$location', 'Auth',
    function($scope, $location, Auth) {

        $scope.logout = function() {
            var promise = Auth.logout();
            promise.then(function(status) { //Success
                $location.path('/');
            }, function(status) { //Failed

            });
        }

        $scope.isUser = function(){
            return Auth.isUser();
        }

        $scope.isAdmin = function(){
            return Auth.isAdmin();
        }
    }
]);

app.controller('MainController', ['$scope', 'Auth',
    function($scope, Auth) {

    }
]);

app.controller('ToDoController', ['$scope', '$http',
    function($scope, $http) {
        var refresh = function() {
            $http.get('/api/read/todo/all').success(function(res) {
                $scope.todolist = res;
            });
        }
        refresh();

        $scope.addTask = function() {
            if ($scope.task.name != "") {
                $http.post('/api/create/todo/task', $scope.task).success(function(res) {
                    $scope.task = "";
                    $scope.todolist = res;
                    refresh();
                });
            }
        };

        $scope.marktaskdone = function(id) {
            $http.post('/api/update/todo/done/' + id).success(function(res) {
                $scope.todolist = res;
                refresh();
            });
        };

        $scope.marktasknotdone = function(id) {
            $http.post('/api/update/todo/notdone/' + id).success(function(res) {
                $scope.todolist = res;
                refresh();
            });
        };

        $scope.removetask = function(id) {
            $http.delete('/api/delete/todo/' + id).success(function(res) {
                $scope.todolist = res;
                refresh();
            });
        };

    }
]);

app.controller('AccountController', ['$scope', 'Auth', '$http',
    function($scope, Auth, $http) {
        $scope.currentTab = 0;
        $scope.error = "";
        $scope.success = "";
        $scope.dataLoading = false;
        $scope.user = {};
        $scope.setTab = function(tab){
            $scope.currentTab = tab;
        }

        $scope.updatePassword = function(){
            $scope.error = "";
            $scope.success = "";
            
            if($scope.user.newpassword != $scope.user.newrepassword){
                $scope.error = "Passwords do not match";
                return
            }

            $scope.dataLoading = true;
            $http.post('/api/update/user/password', $scope.user).success(function(res) {
                $scope.dataLoading = false;
                if(res == 'true'){
                    Auth.requestUser();
                    $scope.success = "Password Updated";
                }else{
                    $scope.error = res;
                }
                $scope.user = {};
            });
        }

        $scope.updateEmail = function(){
            $scope.error = "";
            $scope.success = "";
            $scope.dataLoading = true;

            $http.post('/api/update/user/email', $scope.user).success(function(res) {
                $scope.dataLoading = false;
                if(res == 'true'){
                    Auth.requestUser();
                    $scope.success = "Email Updated";
                }else{
                    $scope.error = res;
                }
                $scope.user = {};
            });
        }
    }
]);

app.controller('AdminController', ['$scope', 'Auth', '$http',
    function($scope, Auth, $http) {
        $scope.currentTab = 0;
        $scope.users = {};
        $scope.selectedUserIndex = 0;
        $scope.selectedUser = {};
        $scope.success = "";
        $scope.dataLoading = false;

        $scope.setTab = function(tab){
            if(tab == 1){
                refreshUsers();
            }
            $scope.currentTab = tab;
        }

        $scope.setSelectedUser = function(index){
            $scope.success = "";
            $scope.selectedUserIndex = index;
            $scope.selectedUser = $scope.users[index];
        }

        $scope.editUser = function(){
            $scope.success = "";
            $scope.dataLoading = true;
            console.log($scope.selectedUser.role);
            $http.post('/api/update/user/role/' + $scope.selectedUser._id, $scope.selectedUser).success(function(res) {
                $scope.dataLoading = false;
                $scope.success = "User Updated";
                $scope.users[$scope.selectedUser] = res;
            });
        }

        var refreshUsers = function() {
            $http.get('/api/read/users/all').success(function(res) {
                $scope.users = res;
                $scope.selectedUser = $scope.users[$scope.selectedUserIndex];
            });
        }
    }
]);