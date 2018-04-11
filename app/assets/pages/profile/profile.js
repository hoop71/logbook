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



.controller('profileCtrl', ['$scope','$interval','$state','MENU_ITEMS', 'adminserv','$firebaseObject','firebase','SweetAlert','errorHandler', function($scope, $interval, $state, MENU_ITEMS, adminserv, $firebaseObject, firebase, SweetAlert, errorHandler) {
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
	$scope.menuItems[4].class="active";

	$scope.modoEdit = false;

	$scope.today = new Date();

	$scope.listaElementos = [];

	$scope.currentContext = null;

	$scope.avatarNumbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

	var endDate = null;
	$scope.countdown = {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	}
	

	var userId = adminserv.getUser();

	var refUsuario = firebase.database().ref('users/'+userId);
	var objUsuario = $firebaseObject(refUsuario);
	objUsuario.$loaded().then(function(){
		
		$scope.user = objUsuario;
		if ($scope.user.status == "newUser") {
			$state.go('welcome');
		}
		$scope.fechainicio = new Date($scope.user.fechainicio);
	
		endDate = $scope.fechainicio.setYear($scope.fechainicio.getFullYear() + 4);
		
		$scope.universidad = adminserv.getNameById('universidad',$scope.user.universidad, true);
		if (!$scope.user.anores) {
			$scope.user.anores = adminserv.getAnores($scope.fechainicio, $scope.today);
		}
		$scope.iniciarTimer();
		
	})

	$scope.editar = function(){
		$scope.modoEdit = true;
	}
	$scope.iniciarTimer = function(){
		$interval(function() {
			// Get todays date and time
			var now = new Date().getTime();

			// Find the distance between now an the count down date
			var distance = endDate - now;

			// Time calculations for days, hours, minutes and seconds

			$scope.countdown.years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
			$scope.countdown.days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
			$scope.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			$scope.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			$scope.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// $scope.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
			// $scope.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			// $scope.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			// $scope.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
			// If the count down is finished, write some text 
			if (distance < 0) {
				clearInterval(x);
				document.getElementById("demo").innerHTML = "EXPIRED";
			}
		},1000)

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
    	  $scope.seleccion.splice(idx, 1); //no está funcionando el auto save cuando se agrega un elemento después de haberlo quitado en el mismo momento.
    	}

    	// Is newly selected
    	else {
    	  	$scope.seleccion.push(element);
    	}
    	$scope.user.$save()
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
    			$('#modalFav').modal('toggle')
    		})
    	}, function(error) {
    	  console.log("Error:", error);
    	});
    }
    $scope.enviarMsj = function(){
		if ($scope.mensaje && $scope.mensaje != "") {
			var ya = new Date();
			if ($scope.destino.logbook) {
				var refMensaje = firebase.database().ref('mensajes/');
		    	refMensaje.push({
		    		fecha: ya.toString(),
		    		mensaje: $scope.mensaje,
		    		autor: adminserv.getUser(),
		    		destino: "adminLogbook"
		    	}).then(function(){
		    		$scope.mensaje = "";
		    		var errorMessage = errorHandler.getErrorMessage('mssg/success');
				  	SweetAlert.swal({
				  		type: errorMessage.type,
				  		text: errorMessage.message
				  	})

		    	})
		    }
		    if ($scope.destino.logbook) {
				var refMensaje = firebase.database().ref('mensajes/');
		    	refMensaje.push({
		    		fecha: ya.toString(),
		    		mensaje: $scope.mensaje,
		    		autor: adminserv.getUser(),
		    		destino: "adminUni"
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
    }

    $scope.selectAvatar = function(sex, ind){
    	if (sex === "man") {
    		$scope.user.fotoperfil = './assets/img/avatars/052-man-'+ind+'.svg'
    	}else{
    		$scope.user.fotoperfil = './assets/img/avatars/052-woman-'+ind+'.svg'
    	}
    }

    $scope.changeDate = function(){
    	$scope.user.anores = adminserv.getAnores($scope.fechainicio, $scope.today);
    }

    $scope.logout = function(){
		adminserv.logoutUser();
		$state.go('login');
	}
}])