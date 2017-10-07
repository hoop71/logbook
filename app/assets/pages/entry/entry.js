'use strict';
 
angular.module('logbookweb.entry', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('entry', {
		url: '/nuevaentrada',
		templateUrl:'assets/pages/entry/entry.html',
		controller: 'entryCtrl'
	})

}])



.controller('entryCtrl', ['$scope','$state', function($scope, $state) {
	$.material.init();
	//js
}])