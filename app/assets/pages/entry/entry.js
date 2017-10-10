'use strict';
 
angular.module('logbookweb.entry', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('entry', {
		url: '/nuevaentrada',
		templateUrl:'assets/pages/entry/entry.html',
		controller: 'entryCtrl',
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



.controller('entryCtrl', ['$scope','$state', 'MENU_ITEMS', function($scope, $state, MENU_ITEMS) {
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[2].class="active"
	var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

	if (isWindows) {
	    // if we are on windows OS we activate the perfectScrollbar function
	    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

	    $('html').addClass('perfect-scrollbar-on');
	} else {
	    $('html').addClass('perfect-scrollbar-off');
	}
	$.material.init();
	$scope.selectedStep = [true, false, false, false];
	$scope.stepClasses = ["active", "", "", ""];

	$scope.changeToStep = function(step){
		$scope.selectedStep = [false, false, false, false];
		$scope.selectedStep[step-1] = true;
		$scope.stepClasses = ["","","",""];
		$scope.stepClasses[step-1] = "active"
	}

}])