var myApp = angular.module('myApp',[]);

myApp.controller('AppCtrl', ['$scope','$http', function($scope, $http){
	console.log("Hello from controller");

	var refresh = function(){
		$http.get('/api/todolist').success(function(res){
			$scope.todolist = res;
		});
	}
	refresh();

	$scope.addTask = function(){
		if($scope.task.name != ""){
			$http.post('/api/todolist/addtask', $scope.task).success(function(res){
				$scope.task = "";
				$scope.todolist = res;
				refresh();
			});
		}
	};

	$scope.marktaskdone = function(id){
		$http.post('/api/todolist/edittask/markdone/' + id).success(function(res){
			console.log(res);
			$scope.todolist = res;
			refresh();
		});
	};

	$scope.marktasknotdone = function(id){
		$http.post('/api/todolist/edittask/marknotdone/' + id).success(function(res){
			$scope.todolist = res;
			refresh();
		});
	};

	$scope.removetask = function(id){
		$http.delete('/api/todolist/removetask/' + id).success(function(res){
			$scope.todolist = res;
			refresh();
		});
	};

}]);