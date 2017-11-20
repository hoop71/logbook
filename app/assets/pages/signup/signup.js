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




.controller('signupCtrl', ['$scope','$state','adminserv', 'Auth', 'constUniversidades', 'errorHandler', 'SweetAlert','firebase','$firebaseArray', function($scope, $state, adminserv, Auth, constUniversidades, errorHandler, SweetAlert, firebase, $firebaseArray) {
	$.material.init();

	$scope.user = {};
	$scope.universidades = constUniversidades;
	$scope.user.especialidad = 1;
	$scope.user.universidad = 1;
	$scope.cargando = false;
	if (adminserv.getUser()) {
		$state.go('perfil');
	};
	$scope.crearUsuario = function() {
		$scope.message = null;
		$scope.error = null;

		// Create a new user
		if ($scope.user.nombre && $scope.user.email && $scope.user.password && $scope.user.universidad) {
			$scope.cargando = true;
			console.log($scope.user)
			Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
				.then(function(firebaseUser) {
				$scope.user.uid = firebaseUser.uid;
				$scope.user.fotoperfil = 'https://robohash.org/'+$scope.user.email;
			  	
			  	var newUser = {
			  		email: $scope.user.email,
			  		especialidad: parseInt(1),
			  		fotoperfil: $scope.user.fotoperfil,
			  		nombre: $scope.user.nombre,
			  		uid: $scope.user.uid,
			  		universidad: parseInt($scope.user.universidad)
			  	}
			  	var usersRef = firebase.database().ref('users').limitToLast(1);
			  	var usersList = $firebaseArray(usersRef);
			  	usersList.$loaded().then(function(){
			  		usersList.$add(newUser).then(function(createResult){
			  			adminserv.setUser(createResult.key);
			  			adminserv.setEspecialidad(newUser.especialidad)
			  			adminserv.setDatosCondicionales(newUser.especialidad);
			  			$scope.cargando = false;
			  			$state.go('profile');
			  		})
			  	})
			}).catch(function(error) {
				$scope.cargando = false;
			  	console.log(error);
			  	var errorMessage = errorHandler.getErrorMessage(error.code);
			  	SweetAlert.swal({
			  		type: errorMessage.type,
			  		text: errorMessage.message
			  	})
			});
		}else{
			var errorMessage = errorHandler.getErrorMessage('form/incomplete-fields');
			SweetAlert.swal({
				type: errorMessage.type,
				text: errorMessage.message
			})
		}
	};
}])