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



.controller('profileCtrl', ['$scope','$state','MENU_ITEMS', 'adminserv','$firebaseObject','firebase','SweetAlert', function($scope, $state, MENU_ITEMS, adminserv, $firebaseObject, firebase, SweetAlert) {
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
	$scope.menuItems[3].class="active";

	$scope.modoEdit = false;

	$scope.today = new Date();
	

	var userId = adminserv.getUser();

	var refUsuario = firebase.database().ref('users/'+userId);
	var objUsuario = $firebaseObject(refUsuario);
	objUsuario.$loaded().then(function(){
		$scope.user = objUsuario;
		$scope.fechainicio = new Date($scope.user.fechainicio);
		$scope.universidad = adminserv.getNameById('universidad',$scope.user.universidad, true);
		if (!$scope.user.anores) {
			$scope.user.anores = adminserv.getAnores($scope.fechainicio, $scope.today);
		}
	})

	$scope.editar = function(){
		$scope.modoEdit = true;
	}

	$scope.guardar = function(){
		$scope.user.fechainicio = $scope.fechainicio.toString();
		$scope.modoEdit = false;
		console.log($scope.user)
		$scope.user.$save().then(function(ref) {
			SweetAlert.swal({
				type: 'success',
				text: 'Tu perfil se ha actualizado de manera exitosa!'
			}).then(function (response) {
				
			})
		}, function(error) {
		  console.log("Error:", error);
		});
	}
}])