'use strict';
 
angular.module('logbookweb.table', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('table', {
		url: '/bitacora',
		templateUrl:'assets/pages/table/table.html',
		controller: 'tableCtrl'
	})

}])



.controller('tableCtrl', ['$scope','$state','MENU_ITEMS', function($scope, $state, MENU_ITEMS) {
	
	
	$.material.init();
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[1].class="active"
	console.log($scope.menuItems)
}])