'use strict';
 
angular.module('logbookweb.profile', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('profile', {
		url: '/perfil',
		templateUrl:'assets/pages/profile/profile.html',
		controller: 'profileCtrl'
	})

}])



.controller('profileCtrl', ['$scope','$state','MENU_ITEMS', function($scope, $state, MENU_ITEMS) {
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[3].class="active"
	$.material.init();
	//js
}])