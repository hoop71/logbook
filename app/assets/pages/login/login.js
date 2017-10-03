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
	//js
}])