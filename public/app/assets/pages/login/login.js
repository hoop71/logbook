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
						$state.go('table')
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
				if (false) {
					$state.go('error');
				}else{
					var ref = firebase.database().ref('users');
			    	var list = $firebaseArray(ref.orderByChild('uid').equalTo(firebaseUser.uid));
			    	list.$loaded().then(function(){
				    	adminserv.setUser(list[0].$id);
				    	console.log("login:"+adminserv.getUser())
				    	adminserv.setEspecialidad(list[0].especialidad);
				    	adminserv.setUniversidad(list[0].universidad);
				    	adminserv.setDatosCondicionales(list[0].universidad,list[0].especialidad);
				    	$scope.cargando = false;
					 	$state.go('table');
			    	})
		    	}
			}).catch(function(error){
				$scope.cargando = false;
		    	$scope.error = error;
		    	var errorMessage = errorHandler.getErrorMessage(error.code);
		    	SweetAlert.swal({
		    		type: errorMessage.type,
		    		text: errorMessage.message
		    	})
		    })
		}else{
			var errorMessage = errorHandler.getErrorMessage('form/incomplete-fields');
			SweetAlert.swal({
				type: errorMessage.type,
				text: errorMessage.message
			})
			//swal('Any fool can use a computer')
		}
	}
	$scope.resetPassword = function(){
		SweetAlert.swal({
			title: 'Escribe el email con el que estás registrado.',
			input: 'email',
			showCancelButton: true,
			confirmButtonText: 'Submit',
			showLoaderOnConfirm: true,
			preConfirm: (email) => {
				return new Promise((resolve) => {
					console.log(email)
					Auth.$sendPasswordResetEmail(email).then(function() {
						var errorMessage = errorHandler.getErrorMessage('login/newpassemail-sent');
						SweetAlert.swal({
							type: errorMessage.type,
							text: errorMessage.message
						})
					}).catch(function(error) {
					  console.error("Error: ", error);
					});
				    resolve()
				 })
			}
		})
	}
}])