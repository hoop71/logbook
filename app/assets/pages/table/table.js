'use strict';
 
angular.module('logbookweb.table', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('table', {
		url: '/bitacora',
		templateUrl:'assets/pages/table/table.html',
		controller: 'tableCtrl',
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



.controller('tableCtrl', ['$scope','$state','MENU_ITEMS', function($scope, $state, MENU_ITEMS) {
	
	
	$.material.init();
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[1].class="active"
	console.log($scope.menuItems)
}])