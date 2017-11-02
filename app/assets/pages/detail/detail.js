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



.controller('detailCtrl', ['adminserv','$scope','$state','$rootScope','$firebaseObject', function(adminserv, $scope, $state, $rootScope, $firebaseObject) {
	
	if (!adminserv.getSeleccion()) {
		$state.go('perfil');
	};

	$scope.adminserv = adminserv;

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
	// $http.get("js/diagnosticos.js").then(function(data) {
	//     $scope.diagjson  = data.data;
	// })
	var seleccion = adminserv.getSeleccion();
	var refEntrada = firebase.database().ref('entradas/'+userId+'/'+seleccion);
	var objEntrada = $firebaseObject(refEntrada);
	$scope.modoEdit = false;
	$scope.cargando = false;
	objEntrada.$loaded().then(function(result) {
		$scope.entrada = result;
		$scope.entrada.fecha = new Date($scope.entrada.fecha);
		// interpretarFecha($scope.entrada.fecha);
		// $scope.seleccionDiag = $scope.entrada.diagnostico;
		// $scope.seleccionCiru = [];
		// $scope.entrada.cirugia.forEach(function(entryC){
		// 	$scope.seleccionCiru.push(entryC.id);
		// })
	});
	$.material.init();
}])