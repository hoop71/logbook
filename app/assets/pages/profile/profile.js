'use strict';
 
angular.module('logbookweb.profile', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('profile', {
		url: '/perfil',
		templateUrl:'assets/pages/profile/profile.html',
		controller: 'profileCtrl',
		resolve: {
			'currentAuth': ['Auth',function(Auth){
				return Auth.$requireSignIn();

			}]
			// controller will not be loaded until $requireSignIn resolves
			// Auth refers to our $firebaseAuth wrapper in the factory below
			// 'currentAuth': ['Auth', function(Auth) {
			// 	// $requireSignIn returns a promise so the resolve waits for it to complete
			// 	// If the promise is rejected, it will throw a $stateChangeError (see above)
				
			// 	return Auth.$requireSignIn();
			// }]
		}
	})

}])



.controller('profileCtrl', ['$scope','$state','MENU_ITEMS', function($scope, $state, MENU_ITEMS) {
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[3].class="active"
	$.material.init();
	//js
}])