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
	$scope.adminserv = adminserv;
	var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

	if (isWindows) {
	    // if we are on windows OS we activate the perfectScrollbar function
	    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

	    $('html').addClass('perfect-scrollbar-on');
	} else {
	    $('html').addClass('perfect-scrollbar-off');
	}
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[1].class="active"
	console.log(adminserv.getUser())
	var refEntradas = firebase.database().ref('entradas/'+adminserv.getUser()).limitToFirst(2).startAt(0).orderByChild("especialidad").equalTo(parseInt('1'));
    var listEntradas = $firebaseArray(refEntradas);
    listEntradas.$loaded().then(function(){
    	$scope.entradas = listEntradas;
    	console.log($scope.entradas.length)
    })
}])