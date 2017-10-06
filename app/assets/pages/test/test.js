// var app = angular.module("ap",[]);

// app.controller("con",function($scope){
//   $scope.class = "red";
//   $scope.changeClass = function(){
//     if ($scope.class === "red")
//       $scope.class = "blue";
//     else
//       $scope.class = "red";
//   };
// });


'use strict';
 
angular.module('logbookweb.login', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('login', {
		url: '/login',
		templateUrl:'assets/pages/login/login.html',
		controller: 'loginCtrl'
	})

}])



.controller('loginCtrl', ['$scope','$state', function($scope, $state) {
	$.material.init();
	//js
}])