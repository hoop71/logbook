'use strict';
 
angular.module('logbookweb.login', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('login', {
		url: '/login',
		templateUrl:'assets/pages/login/login.html',
		controller: 'loginCtrl'
	})

}])



.controller('loginCtrl', ['$scope','$state','adminserv','Auth', function($scope, $state, adminserv, Auth) {
	// CSS initializations
	$.material.init();
	//$scope.user = {}

	$scope.cargando = false;
	// if (adminserv.getUser()) {
	// 	$state.go('perfil');
	// };
	$scope.login = function(){
		if ($scope.user.email && $scope.user.password) {
			$scope.cargando = true
			Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser){
				// var ref = firebase.database().ref('users');
		  //   	var list = $firebaseArray(ref.orderByChild('uid').equalTo(firebaseUser.uid));
		  //   	list.$loaded().then(function(){
			 //    	adminserv.setUser(list[0].$id);
			 //    	adminserv.setEspecialidad(list[0].especialidad);
			 //    	adminserv.setDatosCondicionales(list[0].especialidad);
			 //    	$scope.cargando = false;
				// 	$state.go('perfil');
		  //   	})
		  	console.log("adentro")
			}).catch(function(error){
				$scope.cargando = false;
		    	$scope.error = error;
		    	console.log(error);
		    	//Materialize.toast('Usuario o contraseña no válido', 3000, 'rounded')
		    	swal('Any fool can use a computer')
		    })
		}else{
			//Materialize.toast('Debes llenar todos los campos', 3000, 'rounded')
			console.log($scope.user)
			swal('Any fool can use a computer')
		}
	}
}])