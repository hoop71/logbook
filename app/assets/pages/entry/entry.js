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



.controller('entryCtrl', ['$scope','$state', 'adminserv', 'MENU_ITEMS', 'firebase', '$firebaseObject', '$firebaseArray', 'SweetAlert', function($scope, $state, adminserv, MENU_ITEMS, firebase, $firebaseObject, $firebaseArray, SweetAlert) {
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
	
	$scope.tabShow = ["active", ""];

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
	var userId = adminserv.getUser();

	var refUsuario = firebase.database().ref('users/'+userId);
	var objUsuario = $firebaseObject(refUsuario);
	var fechainicio = new Date();
	objUsuario.$loaded().then(function(){
		// $scope.lugares = adminserv.getSelectInfo('lugares');
		// $scope.rotaciones = adminserv.getSelectInfo('rotaciones');
		// $scope.diagnosticos = adminserv.getSelectInfo('diagnosticos');
		// $scope.cirugias = adminserv.getSelectInfo('cirugias');
		// $scope.complicaciones = adminserv.getSelectInfo('complicaciones');
		// $scope.profesores = adminserv.getSelectInfo('profesores');
		fechainicio = new Date(objUsuario.fechainicio);
		$scope.entrada.anores = objUsuario.anores;
		if (objUsuario.cirugiasRecientes) {
			objUsuario.cirugiasRecientes.forEach(function(entryRec){
				$scope.cirugiasRecientes.push(adminserv.searchById($scope.cirugias, entryRec)) 
			})
		};
		if (objUsuario.diagnosticosRecientes) {
			objUsuario.diagnosticosRecientes.forEach(function(entryRec){
				$scope.diagnosticosRecientes.push(adminserv.searchById($scope.diagnosticos, entryRec)) 
			})
		};
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
	$scope.changeTab = function(tabName){
		//$('#'+tabName).tab('show');
		$scope.tabShow = ["", ""];
		switch(tabName){
			case 'opcionales':
				$scope.tabShow = ["active", ""];
				break;
			case 'complicaciones':
				$scope.tabShow = ["", "active"];
				break;
		}
		$('#opcionales').tab('show')
	}
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
	$scope.setConditional = function(variable, valor){
		switch(variable){
			case "feeling":
				$scope.entrada.opcionales.feeling = valor;
				break;
			case "tipoCir":
				$scope.entrada.tipoCir = valor;
				break;
			case "rol":
				$scope.entrada.rol = valor;
				break;
		}
		
	}

	var agregarRecientes = function(){
		if (objUsuario.cirugiasRecientes) {
			$scope.seleccionCiru.forEach(function(entrySel){
				if (objUsuario.cirugiasRecientes.indexOf(entrySel)<0) {
					objUsuario.cirugiasRecientes.push(entrySel)
				};
			})
		}else{
			objUsuario.cirugiasRecientes = $scope.seleccionCiru;
		}
		if (objUsuario.diagnosticosRecientes) {
			$scope.seleccionDiag.forEach(function(entrySel){
				if (objUsuario.diagnosticosRecientes.indexOf(entrySel)<0) {
					objUsuario.diagnosticosRecientes.push(entrySel)
				};
			})
		}else{
			objUsuario.diagnosticosRecientes = $scope.seleccionDiag;
		}


		objUsuario.$save().then(function(result){

		});
	}

	$scope.preview = function (){
		
		console.log("trying")
		$scope.cargando = true;
		$scope.entrada.diagnostico = $scope.seleccionDiag;
		$scope.entrada.cirugia = [];
		var today = new Date();
		$scope.entrada.fechaIngreso = today.toString();
		if ($scope.entrada.profesor && $scope.cirugiasElegidas.length>0 && $scope.entrada.diagnostico.length>0 && $scope.entrada.lugar && $scope.entrada.identificacion && $scope.entrada.rol && $scope.entrada.rotacion && $scope.entrada.tipoCir) {
			agregarRecientes();
			$scope.seleccionCiru.forEach(function(entry, index){
				$scope.entrada.cirugia[index] = {
					'id': entry,
					'mininv': $scope.cirugiasElegidas[index].mininv,
					'conv': $scope.cirugiasElegidas[index].conv
				}
			});
			if ($scope.seleccionComplic.length>0) {
				$scope.entrada.complicaciones = $scope.seleccionComplic;
			};
			//$scope.entrada.anores = Math.ceil(($scope.entrada.fecha - fechainicio)/31536000000);
			$scope.entrada.fecha = $scope.entrada.fecha.toString();
			$scope.entrada.especialidad = 1;

			var refEntradas = firebase.database().ref('entradas/'+userId);
			var listEntradas = $firebaseArray(refEntradas);
			listEntradas.$add($scope.entrada).then(function(result){
				
				
				// if(objeserv.agregarEntrada(objUsuario, $scope.entrada, result.key)){
				// 	objUsuario.$save().then(function(){
				// 		Materialize.toast('la entrada se agregó a al menos un objetivo!', 3000, 'rounded')
				// 	}).catch(function(){})
					
				// }
				$scope.cargando = false;
				SweetAlert.swal({
					type: 'success',
					text: 'La entrada se agregó exitosamente!'
				}).then(function (response) {
					$state.go('table')
				})
				
			}).catch(function(error){
				$scope.cargando = false;
				console.log(error)
				Materialize.toast('Error. La entrada no se ha guardado.', 3000, 'rounded')
			})
		}else{
			$scope.cargando = false;
			var faltan = "Te falta llenar los campos: ";
			if (!$scope.entrada.profesor) {faltan = faltan+"Profesor, "};
			if ($scope.entrada.cirugia.length<=0) {faltan = faltan+"Cirugias, "};
			if ($scope.entrada.diagnostico.length<=0) {faltan = faltan+"Diagnósticos, "};
			if (!$scope.entrada.lugar) {faltan = faltan+"Lugar, "};
			if (!$scope.entrada.rotacion) {faltan = faltan+"Rotación, "};
			if (!$scope.entrada.identificacion) {faltan = faltan+"Identificación del paciente, "};
			if (!$scope.entrada.rol) {faltan = faltan+"Tu rol en la cirugía, "};
			if (!$scope.entrada.tipoCir) {faltan = faltan+"El tipo de la cirugía, "};
			SweetAlert.swal({
				type: 'warning',
				text: faltan,
				onOpen: function () {
				    swal.showLoading()
				  }
			})
		}
		console.log($scope.entrada)
	}
}])