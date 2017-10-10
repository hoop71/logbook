'use strict';
 
angular.module('logbookweb.dashboard', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('dashboard', {
		url: '/dashboard',
		templateUrl:'assets/pages/dashboard/dashboard.html',
		controller: 'dashboardCtrl',
		resolve: {

			// controller will not be loaded until $requireSignIn resolves
			// Auth refers to our $firebaseAuth wrapper in the factory below
			'currentAuth': ['Auth', function(Auth) {
				// $requireSignIn returns a promise so the resolve waits for it to complete
				// If the promise is rejected, it will throw a $stateChangeError (see above)
			
				return Auth.$requireSignIn();
			}]
		}
	})

}])




.controller('dashboardCtrl', ['$scope','$state', 'MENU_ITEMS', 'Auth', function($scope, $state, MENU_ITEMS, Auth) {
	//js
	console.log("controller")
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