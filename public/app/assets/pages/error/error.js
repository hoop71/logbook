'use strict';
 
angular.module('logbookweb.error', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('error', {
		url: '/error',
		templateUrl:'assets/pages/error/error.html',
		controller: 'errorCtrl'
	})

}])



.controller('errorCtrl', ['$scope','$state', function($scope, $state) {
	$.material.init();
	//js
}])