'use strict';
 
angular.module('logbookweb.dashboard', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('dashboard', {
		url: '/dashboard',
		templateUrl:'assets/pages/dashboard/dashboard.html',
		controller: 'dashboardCtrl'
	})

}])




.controller('dashboardCtrl', ['$scope','$state', function($scope, $state) {
	//js
}])