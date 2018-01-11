'use strict';
 
angular.module('logbookweb.objectives', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('objectives', {
		url: '/objetivos',
		templateUrl:'assets/pages/objectives/objectives.html',
		controller: 'objectivesCtrl',
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




.controller('objectivesCtrl', ['$scope','$state','adminserv', 'MENU_ITEMS','CHART_CONF', 'Auth', 'firebase', '$firebaseObject', '$firebaseArray','constDirectrices', function($scope, $state, adminserv, MENU_ITEMS, CHART_CONF, Auth, firebase, $firebaseObject, $firebaseArray, constDirectrices) {
	console.log("obectives")
	$.material.init();
	var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

	if (isWindows) {
	    // if we are on windows OS we activate the perfectScrollbar function
	    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

	    $('html').addClass('perfect-scrollbar-on');
	} else {
	    $('html').addClass('perfect-scrollbar-off');
	}
	$scope.adminserv = adminserv;
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[1].class="active";

	$scope.selectedStep = [true, false, false, false, false];
	$scope.stepClasses = ["active", "", "", "", ""];

}])