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

        $scope.isLoggedIn = function(){
            return Auth.isLoggedIn();
        }
    }
]);

app.controller('MainController', ['$scope', 'Auth',
    function($scope, Auth) {

    }
]);

app.controller('VerificationController', ['$scope', 'Auth', '$http','$routeParams',
    function($scope, Auth, $http, $routeParams) {
        $scope.token = $routeParams.token;
        $scope.success = "";
        $scope.error = "";

        $scope.verifyEmail = function(){
            $scope.success = "";
            $scope.error = "";
            $http.post('/api/email/verify', {token: $scope.token}).success(function(res) {
                if(res == "true"){
                    $scope.success = "Email verified";
                    Auth.requestUser();
                }else{
                    $scope.error = res;
                }
            });
        }
        
    }
]);

app.controller('ToDoController', ['$scope', '$http',
    function($scope, $http) {
        var refresh = function() {
            $http.get('/api/todo/all').success(function(res) {
                $scope.todolist = res;
            });
        }
        refresh();

        $scope.addTask = function() {
            if ($scope.task.name != "") {
                $http.post('/api/todo/task', $scope.task).success(function(res) {
                    $scope.task = "";
                    $scope.todolist = res;
                    refresh();
                });
            }
        };

        $scope.marktaskdone = function(id) {
            $http.post('/api/todo/done/' + id).success(function(res) {
                $scope.todolist = res;
                refresh();
            });
        };

        $scope.marktasknotdone = function(id) {
            $http.post('/api/todo/notdone/' + id).success(function(res) {
                $scope.todolist = res;
                refresh();
            });
        };

        $scope.removetask = function(id) {
            $http.delete('/api/todo/' + id).success(function(res) {
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
            $http.post('/api/user/password', $scope.user).success(function(res) {
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

            $http.post('/api/user/email', $scope.user).success(function(res) {
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

        $scope.updateSettings = function(){
            
            if($scope.user.allowemail == null){
                $scope.user.allowemail = false;
            }

            $scope.error = "";
            $scope.success = "";
            $scope.dataLoading = true;

            $http.post('/api/user/settings', $scope.user).success(function(res) {
                $scope.dataLoading = false;
                if(res == 'true'){
                    Auth.requestUser();
                    $scope.success = "Settings Updated";
                }else{
                    $scope.error = res;
                }
                $scope.user = {};
            });

        }

        $scope.resendVerify = function(){
            $scope.success = "";
            $http.post('/api/email/reverify').success(function(res) {
                if(res == 'true'){
                    Auth.requestUser();
                    $scope.success = "Email Sent";
                }else{
                    $scope.error = res;
                }
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
        $scope.userEmail = {};
        $scope.massEmail = {};
        $scope.success = "";
        $scope.dataLoading = false;

        $scope.setTab = function(tab){
            $scope.success = "";
            $scope.dataLoading = false;
            if(tab == 1 || tab == 2){
                refreshUsers();
            }
            $scope.currentTab = tab;
        }

        $scope.setSelectedUser = function(index){
            $scope.success = "";
            $scope.dataLoading = false;
            $scope.userEmail = {};
            $scope.selectedUserIndex = index;
            $scope.selectedUser = $scope.users[index];
        }

        $scope.editUser = function(){
            $scope.success = "";
            $scope.dataLoading = true;
            $http.post('/api/user/role/' + $scope.selectedUser._id, $scope.selectedUser).success(function(res) {
                $http.post('/api/user/email/' + $scope.selectedUser._id, $scope.selectedUser).success(function(res) {
                    $scope.dataLoading = false;
                    $scope.success = "User Updated";
                    $scope.users[$scope.selectedUser] = res;

                });
            });
        }

        $scope.sendMail = function(){
            $scope.success = "";
            $scope.dataLoading = true;
            $http.post('/api/email/user/' + $scope.selectedUser._id, {subject: $scope.userEmail.subject, message: $scope.userEmail.message}).success(function(res) {
                $scope.success = "Message Sent";
                $scope.userEmail = {};
                $scope.dataLoading = false;
            });
        }

        $scope.massMail = function(){
            $scope.success = "";
            $scope.dataLoading = true;
            $http.post('/api/email/all', {subject: $scope.massEmail.subject, message: $scope.massEmail.message}).success(function(res) {
                $scope.success = "Message Sent";
                $scope.massEmail = {};
                $scope.dataLoading = false;
            });
        }

        var refreshUsers = function() {
            $scope.success = "";
            $scope.selectedUserIndex = 0;
            $scope.selectedUser = {};
            $http.get('/api/user').success(function(res) {
                $scope.users = res;
                $scope.selectedUser = $scope.users[$scope.selectedUserIndex];
            });
        }
    }
]);