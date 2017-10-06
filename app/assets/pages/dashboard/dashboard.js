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




.controller('dashboardCtrl', ['$scope','$state', 'MENU_ITEMS', function($scope, $state, MENU_ITEMS) {
	//js
	$.material.init();
	var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

	if (isWindows) {
	    // if we are on windows OS we activate the perfectScrollbar function
	    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

	    $('html').addClass('perfect-scrollbar-on');
	} else {
	    $('html').addClass('perfect-scrollbar-off');
	}
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[0].class="active"
}])