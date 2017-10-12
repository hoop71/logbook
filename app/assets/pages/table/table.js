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



.controller('tableCtrl', ['$scope','$state','MENU_ITEMS','adminserv','$firebaseArray', function($scope, $state, MENU_ITEMS, adminserv, $firebaseArray) {
	
	
	$.material.init();
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[1].class="active"
	console.log(adminserv.getUser())
	var refEntradas = firebase.database().ref('entradas/'+adminserv.getUser()).orderByChild("especialidad").equalTo(parseInt('1'));
    var listEntradas = $firebaseArray(refEntradas);
    listEntradas.$loaded().then(function(){
    	$scope.entradas = listEntradas;
    	console.log($scope.entradas.length)
    })
}])