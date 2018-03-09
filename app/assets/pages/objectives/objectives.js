'use strict';
 
angular.module('logbookweb.objectives', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('objectives', {
		url: '/objetivos',
		templateUrl:'assets/pages/objectives/objectives.html',
		controller: 'objectivesCtrl',
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




.controller('objectivesCtrl', ['$scope','$state','adminserv', 'objectiveServ', 'MENU_ITEMS','CHART_CONF', 'Auth', 'firebase', '$firebaseObject', '$firebaseArray','constDirectrices','SweetAlert', function($scope, $state, adminserv, objectiveServ, MENU_ITEMS, CHART_CONF, Auth, firebase, $firebaseObject, $firebaseArray, constDirectrices, SweetAlert) {
	
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
	$scope.menuItems[1].class="active";

	$scope.selectedStep = [false, true, false, false, false];
	$scope.stepClasses = ["", "active", "", "", ""];

	$scope.cirugias = adminserv.getSelectInfo('cirugias');
	$scope.seleccion = [];

	$scope.rol = {
		cirujano: true,
		primerayudante: false,
		segundoayudante: false
	}

	$scope.newObj = {
		nombre: "",
		descripcion: "",
		rol: [],
		tipo: "personal",
		status: "pendiente"
	}

	$scope.sliderOptions = {
        start: [1, 4],
        range: {min: 1, max: 4},
        step: 1,
        tooltips: true,
        orientation: 'horizontal',
        format: {
        	  to: function ( value ) {
        		return 'R' + value ;
        	  },
        	  from: function ( value ) {
        		return value.replace(',-', '');
        	  }
        	}

    }

	var userId = adminserv.getUser();

	var refUsuario = firebase.database().ref('users/'+userId);
	var objUsuario = $firebaseObject(refUsuario);
	objUsuario.$loaded().then(function(){
		$scope.user = objUsuario;
		$scope.fechainicioRes = new Date(objUsuario.fechainicio);

	})
	

	var refObjetivos = firebase.database().ref('users/'+userId+'/objetivos');
	var listObj = $firebaseArray(refObjetivos);
	listObj.$loaded().then(function(){
		$scope.objetivos = listObj;
	})

	$scope.toggleSelection = function(seleccion){
    	var idx = $scope.seleccion.indexOf(seleccion);

    	// Is currently selected
    	if (idx > -1) {
			$scope.seleccion.splice(idx, 1);
    	}

    	// Is newly selected
    	else {
			$scope.seleccion.push(seleccion);
    	}
    	$scope.filterQx = "";
	}

	$scope.changeToStep = function(step){
		$scope.selectedStep = [false, false, false, false];
		$scope.selectedStep[step-1] = true;
		$scope.stepClasses = ["","","",""];
		$scope.stepClasses[step-1] = "active"
		$.material.init();
	}

	$scope.getProgress = function(currentAmt, total){
		var progress = Math.round((currentAmt/total)*100)
		var progressStr = progress.toString() + "%";
		return {width: progressStr}
	}

	$scope.openModalNewObj = function(){
		$('#modalNewObj').modal('show')
	}
	$scope.saveObjective = function(){
		
		$scope.newObj.fechas = {start: $scope.sliderOptions.start[0], end: $scope.sliderOptions.start[1]};
		$scope.newObj.procedimientos = $scope.seleccion;
		if ($scope.newObj.nombre && $scope.newObj.procedimientos.length>0 && $scope.newObj.cantidad>0) {
			if ($scope.rol.cirujano) {
				$scope.newObj.rol.push(1)
			}
			if ($scope.rol.primerayudante) {
				$scope.newObj.rol.push(2)
			}
			if ($scope.rol.segundoayudante) {
				$scope.newObj.rol.push(3)
			}

			//objectiveServ.addEntrance(result, $scope.entrada, objUsuario.objetivos);
			var refEntradas = firebase.database().ref('entradas/'+userId);

			var listEntradas = $firebaseArray(refEntradas);
			listEntradas.$loaded().then(function(){
			 	objectiveServ.checkRetroactivity(listEntradas, $scope.newObj);
			 	$scope.newObj.status = objectiveServ.checkStatus($scope.newObj);
			 	var refObjetivos = firebase.database().ref('users/'+userId+'/objetivos');
			 	var listObjetivos = $firebaseArray(refObjetivos);
			 	listObjetivos.$add($scope.newObj).then(function(){
			 		$('#modalNewObj').modal('hide')
			 		SweetAlert.swal({
			 			type: 'success',
			 			text: 'El objetivo se agregó exitosamente!'
			 		}).then(function (response) {
			 			$scope.newObj.nombre = "";
			 			$scope.newObj.cantidad = null;
			 			$scope.newObj.procedimientos = [];
			 			
			 		})
			 	})
			})

			
		}else{
			SweetAlert.swal({
				type: 'warning',
				text: "Te faltan datos esenciales para crear un objetivo.",
				onOpen: function () {
				    swal.showLoading()
				}
			})
		}
	}
	$scope.verObjetivo = function(objetivoId){
		console.log(objetivoId)
		adminserv.setSeleccion(objetivoId);
		$state.go('detailObj')
	}

	

}])