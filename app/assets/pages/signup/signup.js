'use strict';
 
angular.module('logbookweb.signup', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('signup', {
		url: '/signup',
		templateUrl:'assets/pages/signup/signup.html',
		controller: 'signupCtrl'
	})

}])




.controller('signupCtrl', ['$scope','$state', function($scope, $state) {
	//js
}])