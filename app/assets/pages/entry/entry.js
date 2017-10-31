'use strict';
 
angular.module('logbookweb.entry', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('entry', {
		url: '/nuevaentrada',
		templateUrl:'assets/pages/entry/entry.html',
		controller: 'entryCtrl',
		resolve: {

			// controller will not be loaded until $requireSignIn resolves
			// Auth refers to our $firebaseAuth wrapper in the factory below
			'currentAuth': ['Auth', function(Auth) {
				// $requireSignIn returns a promise so the resolve waits for it to complete
				// If the promise is rejected, it will throw a $stateChangeError (see above)
			
				return Auth.$requireSignIn();
			}]
		}
	})

}])



.controller('entryCtrl', ['$scope','$state', 'adminserv', 'MENU_ITEMS', function($scope, $state, adminserv, MENU_ITEMS) {
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[2].class="active"

	$scope.seleccionDiag = [];
	$scope.diagnosticosElegidos = [];
	$scope.seleccionCiru = [];
	$scope.seleccionComplic = [];
	$scope.complicacionesElegidas = [];
	$scope.cirugiasElegidas = [];

	$scope.entrada = {};
	$scope.entrada.opcionales = {};
	$scope.entrada.mininv = [];
	$scope.entrada.fecha =new Date();
	$scope.cirugiasRecientes = [];
	$scope.diagnosticosRecientes = [];

	$('#modalMininv').modal({
		show: false
	})
	
	var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

	if (isWindows) {
	    // if we are on windows OS we activate the perfectScrollbar function
	    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

	    $('html').addClass('perfect-scrollbar-on');
	} else {
	    $('html').addClass('perfect-scrollbar-off');
	}
	$scope.lugares = adminserv.getSelectInfo('lugares');
	$scope.rotaciones = adminserv.getSelectInfo('rotaciones');
	$scope.diagnosticos = adminserv.getSelectInfo('diagnosticos');
	$scope.cirugias = adminserv.getSelectInfo('cirugias');
	$scope.complicaciones = adminserv.getSelectInfo('complicaciones');
	$scope.profesores = adminserv.getSelectInfo('profesores');
	$.material.init();

	$scope.selectedStep = [true, false, false, false];
	$scope.stepClasses = ["active", "", "", ""];

	$scope.$on('adminserv:directricesListas', function() {
		$scope.lugares = adminserv.getSelectInfo('lugares');
		$scope.rotaciones = adminserv.getSelectInfo('rotaciones');
		$scope.diagnosticos = adminserv.getSelectInfo('diagnosticos');
		$scope.cirugias = adminserv.getSelectInfo('cirugias');
		$scope.complicaciones = adminserv.getSelectInfo('complicaciones');
		$scope.profesores = adminserv.getSelectInfo('profesores');
		$.material.init();
	})

	$scope.changeToStep = function(step){
		$scope.selectedStep = [false, false, false, false];
		$scope.selectedStep[step-1] = true;
		$scope.stepClasses = ["","","",""];
		$scope.stepClasses[step-1] = "active"
		$.material.init();
	}

	$scope.toggleSelection = function (tipo, seleccion, index) {
	    if (tipo == 'diagnostico') {
	    	var idx = $scope.seleccionDiag.indexOf(seleccion.id);

	    	// Is currently selected
	    	if (idx > -1) {
	    	  $scope.seleccionDiag.splice(idx, 1);
	    	  $scope.diagnosticosElegidos.splice(index,1);
	    	  console.log("diag eliminado")
	    	}

	    	// Is newly selected
	    	else {
	    	  	$scope.seleccionDiag.push(seleccion.id);
	    	  	// Materialize.toast(adminserv.getNameById('diagnostico',seleccion.id,true), 900, 'rounded');
	    	  	$scope.diagnosticosElegidos.push(seleccion);
	    	  	//$scope.diagnosticos.splice(index, 1);
	    	  	// $scope.diagnosticos.unshift(seleccion);
	    	}
	    	$scope.filtroDiagnosticos = "";
	    	//$( "#filtroDiagnosticos" ).focus();
	    }else if(tipo == 'complicacion'){
	    	var idx = $scope.seleccionComplic.indexOf(seleccion.id);

	    	// Is currently selected
	    	if (idx > -1) {
	    	  	$scope.seleccionComplic.splice(idx, 1);
	    	  	$scope.complicacionesElegidas.splice(index, 1)
	    	}
	    	// Is newly selected
	    	else {
	    	  	$scope.seleccionComplic.push(seleccion.id);
	    	  	$scope.complicacionesElegidas.push(seleccion)
	    	}
	    }else{
	    	var idx = $scope.seleccionCiru.indexOf(seleccion.id);

	    	// Is currently selected
	    	if (idx > -1) {
				$scope.seleccionCiru.splice(idx, 1);
				$scope.cirugiasElegidas.splice(index,1);
				//$scope.entrada.mininv.splice(index,1);
	    	}

	    	// Is newly selected
	    	else {
	    		seleccion.mininv = false;
	    		seleccion.conv = false;
				$scope.seleccionCiru.push(seleccion.id);
				$scope.cirugiasElegidas.push(seleccion)
				//$scope.entrada.mininv.push(false);
				// $scope.cirugias.splice(index, 1);
				// $scope.cirugias.unshift(seleccion);
	    	}
	    	$scope.filtroCirugias = "";
	    	//$( "#filtroCirugias" ).focus();
	    };
	    $.material.init();
	};
	$scope.openModal = function(cirugia){
		$scope.cirugiaMod = cirugia;
		$('#modalMininv').modal('show')
	}
	$scope.toggleCaracteristica = function(caracteristica, cirugia){
		switch(caracteristica){
			case "mininv":
				cirugia.mininv = !cirugia.mininv;
				break;
			case "conv":
				cirugia.conv = !cirugia.conv;
				break;
		}
	}
	$scope.preview = function (){
		console.log($scope.entrada)
	}
}])