angular.module('logbookweb.detail', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('detail', {
		url: '/detalle',
		templateUrl:'assets/pages/detail/detail.html',
		controller: 'detailCtrl'
	})

}])



.controller('detailCtrl', ['adminserv','$scope','$state','$rootScope','$firebaseObject', 'MENU_ITEMS','errorHandler','SweetAlert', function(adminserv, $scope, $state, $rootScope, $firebaseObject, MENU_ITEMS, errorHandler, SweetAlert) {
	
	if (!adminserv.getSeleccion()) {
		$state.go('profile');
	};

	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[1].class="active"
	$scope.modeEdit = false;
	$scope.canEdit = false;

	$scope.adminserv = adminserv;

	var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

	if (isWindows) {
	    // if we are on windows OS we activate the perfectScrollbar function
	    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

	    $('html').addClass('perfect-scrollbar-on');
	} else {
	    $('html').addClass('perfect-scrollbar-off');
	}

	//LLAMO DATOS DEL USUARIO
	var userId = adminserv.getUser();

	var refUsuario = firebase.database().ref('users/'+userId);
	var objUsuario = $firebaseObject(refUsuario);
	var fechainicio = new Date();
	objUsuario.$loaded().then(function(){
		fechainicio = new Date(objUsuario.fechainicio);
	})

	$scope.lugares = adminserv.getSelectInfo('lugares');
	$scope.rotaciones = adminserv.getSelectInfo('rotaciones');
	$scope.diagnosticos = adminserv.getSelectInfo('diagnosticos');
	$scope.cirugias = adminserv.getSelectInfo('cirugias');
	$scope.profesores = adminserv.getSelectInfo('profesores');
	var seleccion = adminserv.getSeleccion();
	var refEntrada = firebase.database().ref('entradas/'+userId+'/'+seleccion);
	var objEntrada = $firebaseObject(refEntrada);
	var today = new Date();
	$scope.cargando = false;
	objEntrada.$loaded().then(function(result) {
		$scope.entrada = result;
		$scope.entrada.fecha = new Date($scope.entrada.fecha);
		var daysSince = (today - $scope.entrada.fecha)/86400000;
		if (daysSince>=60) {
			$scope.canEdit = false;
		}else{
			$scope.canEdit = true;
		}
		// interpretarFecha($scope.entrada.fecha);
		// $scope.seleccionDiag = $scope.entrada.diagnostico;
		// $scope.seleccionCiru = [];
		// $scope.entrada.cirugia.forEach(function(entryC){
		// 	$scope.seleccionCiru.push(entryC.id);
		// })
	});
	$.material.init();

	$scope.startEdit = function(){
		$scope.modeEdit = true;
	}
	$scope.saveEdit = function(){
		$scope.entrada.fecha = $scope.entrada.fecha.toString();
		$scope.entrada.$save().then(function(){
			var errorMessage = errorHandler.getErrorMessage('EDIT/success');
			SweetAlert.swal({
				type: errorMessage.type,
				text: errorMessage.message
			})
			$scope.modeEdit = false;
		}).catch(function(error) {
			var errorMessage = errorHandler.getErrorMessage('EDIT/no-success');
			SweetAlert.swal({
				type: errorMessage.type,
				text: errorMessage.message
			})
			$scope.modeEdit = false;
		})
	}
}])