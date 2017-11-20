'use strict';
 
angular.module('logbookweb.login', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('login', {
		url: '/login',
		templateUrl:'assets/pages/login/login.html',
		controller: 'loginCtrl',
		resolve: {

			// 'currentAuth': ['Auth', function(Auth) {
			// 	// $requireSignIn returns a promise so the resolve waits for it to complete
			// 	// If the promise is rejected, it will throw a $stateChangeError (see above)
			// 	console.log("trying")
			// 	return Auth.$requireSignIn();
			// }]
			'checkUser': ['adminserv', '$state', 'firebase', function(adminserv, $state, firebase) {
				// if (adminserv.getUser()) {
				// 	$state.go('profile');
				// }else{
				// 	return true;
				// }
				firebase.auth().onAuthStateChanged(function(user) {
					console.log(user)
					if (user) {
						$state.go('profile')
					// User is signed in.
					} else {
						return true;
					// No user is signed in.
					}
				});
			}]
		}
	})

}])



.controller('loginCtrl', ['$scope','$state','adminserv','Auth','$firebaseArray', 'errorHandler', 'SweetAlert', function($scope, $state, adminserv, Auth, $firebaseArray, errorHandler, SweetAlert) {
	// CSS initializations
	$.material.init();
	//$scope.user = {}

	$scope.cargando = false;
	
	$scope.login = function(){
		if ($scope.user.email && $scope.user.password) {
			$scope.cargando = true
			Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser){
				var ref = firebase.database().ref('users');
		    	var list = $firebaseArray(ref.orderByChild('uid').equalTo(firebaseUser.uid));
		    	list.$loaded().then(function(){
			    	adminserv.setUser(list[0].$id);
			    	adminserv.setEspecialidad(list[0].especialidad);
			    	adminserv.setDatosCondicionales(list[0].especialidad);
			    	$scope.cargando = false;
				 	$state.go('dashboard');
		    	})
			}).catch(function(error){
				$scope.cargando = false;
		    	$scope.error = error;
		    	console.log(error);
		    	var errorMessage = errorHandler.getErrorMessage(error.code);
		    	SweetAlert.swal({
		    		type: 'error',
		    		text: errorMessage
		    	})
		    	//Materialize.toast('Usuario o contraseña no válido', 3000, 'rounded')
		    	//swal('Any fool can use a computer')
		    })
		}else{
			//Materialize.toast('Debes llenar todos los campos', 3000, 'rounded')
			console.log($scope.user)
			//swal('Any fool can use a computer')
		}
	}
}])