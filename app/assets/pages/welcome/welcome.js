'use strict';
 
angular.module('logbookweb.welcome', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('welcome', {
		url: '/bienvenida',
		templateUrl:'assets/pages/welcome/welcome.html',
		controller: 'welcomeCtrl',
		resolve: {
			'currentAuth': ['Auth', function(Auth) {
				return Auth.$requireSignIn();
			}]
		}
	})

}])



.controller('welcomeCtrl', ['$scope','$state', 'adminserv','$firebaseObject','SweetAlert', function($scope, $state, adminserv, $firebaseObject, SweetAlert) {
	$.material.init();
	//js
	var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

	if (isWindows) {
	    // if we are on windows OS we activate the perfectScrollbar function
	    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

	    $('html').addClass('perfect-scrollbar-on');
	} else {
	    $('html').addClass('perfect-scrollbar-off');
	}
	$scope.adminserv = adminserv;

	$scope.today = new Date();

	$scope.avatarNumbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
	$scope.$watch(adminserv.constantsLoaded, function (value, oldValue) {
		if (value) {
			console.log(value)
			var userId = adminserv.getUser();
			//var userId = "-L4D5jYO0wStcDRhtCOr";

			var refUsuario = firebase.database().ref('users/'+userId);
			var objUsuario = $firebaseObject(refUsuario);
			objUsuario.$loaded().then(function(){
				$scope.user = objUsuario;
				if ($scope.user.status != "newUser") {
					$state.go('profile');
				}
				$scope.fechainicio = $scope.today;
				console.log("trying uni")
				$scope.universidad = adminserv.getNameById('universidad',$scope.user.universidad, true);
				$scope.user.anores = adminserv.getAnores($scope.fechainicio, $scope.today);
				$scope.user.fotoperfil = './assets/img/avatars/052-man-1.svg'
			})
		}
	})

	$scope.changeDate = function(){
		$scope.user.anores = adminserv.getAnores($scope.fechainicio, $scope.today);
	}

	$scope.guardar = function(){
		$scope.user.fechainicio = $scope.fechainicio.toString();
		$scope.user.status = "active"
		$scope.user.$save().then(function(ref) {
			SweetAlert.swal({
				type: 'success',
				text: 'Tu perfil se ha actualizado de manera exitosa!'
			}).then(function (response) {
				$state.go('profile');
			})
		}, function(error) {
		  console.log("Error:", error);
		});
	}

	$scope.selectAvatar = function(sex, ind){
		if (sex === "man") {
			$scope.user.fotoperfil = './assets/img/avatars/052-man-'+ind+'.svg'
		}else{
			$scope.user.fotoperfil = './assets/img/avatars/052-woman-'+ind+'.svg'
		}
	}
	
}])