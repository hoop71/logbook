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




.controller('signupCtrl', ['$scope','$state','adminserv', 'Auth', function($scope, $state, adminserv, Auth) {
	$.material.init();

	$scope.user = {};
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
		if ($scope.user.nombre && $scope.user.apellidos && $scope.user.email && $scope.user.password && $scope.user.password2 && $scope.user.universidad && $scope.user.especialidad && $scope.user.fechainicio) {
			if ($scope.user.password == $scope.user.password2) {
				$scope.cargando = true;

				Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
					.then(function(firebaseUser) {
					$scope.user.uid = firebaseUser.uid;
					$scope.user.fechainicio = $scope.user.fechainicio.toString();
					$scope.user.fotoperfil = 'https://robohash.org/'+$scope.user.email;
				  	//$scope.message = "User created with uid: " + firebaseUser.uid;
				  	//console.log($scope.message)
				  	
				  	var newUser = {
				  		apellidos: $scope.user.apellidos,
				  		email: $scope.user.email,
				  		especialidad: parseInt($scope.user.especialidad),
				  		fechainicio: $scope.user.fechainicio,
				  		fotoperfil: $scope.user.fotoperfil,
				  		nombre: $scope.user.nombre,
				  		uid: $scope.user.uid,
				  		universidad: parseInt($scope.user.universidad)
				  	}
				  	var usersRef = firebase.database().ref('users');
				  	var usersList = $firebaseArray(usersRef);
				  	usersList.$loaded().then(function(){
				  		usersList.$add(newUser).then(function(createResult){
				  			adminserv.setUser(createResult.key);
				  			adminserv.setEspecialidad(newUser.especialidad)
				  			adminserv.setDatosCondicionales(newUser.especialidad);
				  			$scope.cargando = false;
				  			$state.go('perfil');
				  		})
				  	})
				}).catch(function(error) {
					$scope.cargando = false;
					//Materialize.toast('Error. Intentalo de nuevo', 3000, 'rounded')
				  	$scope.error = error;
				  	console.log($scope.error)
				});
			}else{
				//Materialize.toast('Verifica tu contraseña', 3000, 'rounded')
			};
		}else{
			//Materialize.toast('Debes llenar todos los campos', 3000, 'rounded')
		}
	};
}])