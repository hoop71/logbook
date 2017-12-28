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



.controller('profileCtrl', ['$scope','$state','MENU_ITEMS', 'adminserv','$firebaseObject','firebase','SweetAlert','errorHandler', function($scope, $state, MENU_ITEMS, adminserv, $firebaseObject, firebase, SweetAlert, errorHandler) {
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

	$scope.listaElementos = [];

	$scope.currentContext = null;
	

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
	$scope.addNew = function(type){
		switch(type){
			case 'qx':
				$scope.listaElementos = adminserv.getSelectInfo('cirugias');
				$scope.currentContext = 'cirugia';
				if ($scope.user.favQx) {
					$scope.seleccion = $scope.user.favQx;
				}else{
					$scope.seleccion = [];
				}
				break;
			case 'dx':
				$scope.listaElementos = adminserv.getSelectInfo('diagnosticos');
				$scope.currentContext = 'diagnostico';
				if ($scope.user.favDx) {
					$scope.seleccion = $scope.user.favDx;
				}else{
					$scope.seleccion = [];
				}	
		}
	}
	$scope.toggleSelection = function (element, index) {
	    
    	var idx = $scope.seleccion.indexOf(element);

    	// Is currently selected
    	if (idx > -1) {
    	  $scope.seleccion.splice(idx, 1);
    	}

    	// Is newly selected
    	else {
    	  	$scope.seleccion.push(element);
    	}
    	$scope.filtro = "";
    }
    $scope.saveFav = function(type){
    	switch(type){
    		case 'cirugia':
    			$scope.user.favQx = $scope.seleccion;
    			break;
    		case 'diagnostico':
    			$scope.user.favDx = $scope.seleccion;
    			break;
    	}
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
    $scope.enviarMsj = function(){
		if ($scope.mensaje && $scope.mensaje != "") {
			var ya = new Date();
			var refMensaje = firebase.database().ref('mensajes/');
	    	refMensaje.push({
	    		fecha: ya.toString(),
	    		mensaje: $scope.mensaje,
	    		autor: adminserv.getUser()
	    	}).then(function(){
	    		$scope.mensaje = "";
	    		var errorMessage = errorHandler.getErrorMessage('mssg/success');
			  	SweetAlert.swal({
			  		type: errorMessage.type,
			  		text: errorMessage.message
			  	})

	    	})
		}
    }

    $scope.logout = function(){
		adminserv.logoutUser();
		$state.go('login');
	}
}])