'use strict';
 
angular.module('logbookweb.table', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('table', {
		url: '/bitacora',
		templateUrl:'assets/pages/table/table.html',
		controller: 'tableCtrl',
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



.controller('tableCtrl', ['$scope','$state','MENU_ITEMS','adminserv','$firebaseArray', function($scope, $state, MENU_ITEMS, adminserv, $firebaseArray) {
	$scope.orderStr = 'fecha'
	
	$.material.init();
	$scope.adminserv = adminserv;
	var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

	if (isWindows) {
	    // if we are on windows OS we activate the perfectScrollbar function
	    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

	    $('html').addClass('perfect-scrollbar-on');
	} else {
	    $('html').addClass('perfect-scrollbar-off');
	}

    $scope.loading = true;

	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[2].class="active"
	
	$scope.$on('adminserv:directricesListas', function() {
		$scope.complicaciones = adminserv.getSelectInfo('complicaciones');
            var refEntradas = firebase.database().ref('entradas/'+adminserv.getUser()).orderByChild("especialidad").equalTo(parseInt('1'));
            
            var listEntradas = $firebaseArray(refEntradas);
            listEntradas.$loaded().then(function(){
                $scope.entradas = listEntradas;
            
            })
	})


	var refEntradas = firebase.database().ref('entradas/'+adminserv.getUser()).orderByChild("especialidad").equalTo(parseInt('1'));

    var listEntradas = $firebaseArray(refEntradas);
    listEntradas.$loaded().then(function(){
    	$scope.entradas = listEntradas;
        $scope.loading = false;
    })


    var selectedEntrada = null;
    $scope.complicacion = function(entrada){
    	$scope.complicaciones = adminserv.getSelectInfo('complicaciones');
    	//$scope.seleccionComplic = [];
    	$('#modalCompli').modal('show');
    	//console.log(listEntradas.$getRecord(entrada.$id))
    	selectedEntrada = entrada;
    	if (!entrada.complicaciones) {
            entrada.complicaciones = [];
    		//$scope.seleccionComplic = entrada.complicaciones;
    	};
        $scope.seleccionComplic = entrada.complicaciones;
    }
    
    $scope.toggleSelection = function (seleccion, index) {
    	//var idx = $scope.seleccionComplic.indexOf(seleccion);
        var idx = selectedEntrada.complicaciones.indexOf(seleccion);

    	// Is currently selected
    	if (idx > -1) {
    	  //$scope.seleccionComplic.splice(idx, 1);
          selectedEntrada.complicaciones.splice(idx,1);
    	}

    	// Is newly selected
    	else {
    	  	//$scope.seleccionComplic.push(seleccion);
            selectedEntrada.complicaciones.push(seleccion)
    	}
        $scope.entradas.$save(selectedEntrada);
        $scope.seleccionComplic = selectedEntrada.complicaciones;
    }

    $scope.ordernarPor = function(filtro){
    	switch(filtro){
    		case 'fecha':
    			$scope.orderFcn = $scope.orderByDate;
    			$scope.activo = [false, 'active'];
    			break;
    		default:
    			$scope.orderFcn = "";
    			$scope.activo = ['active', false];
    			break;
    	}
    }

    $scope.orderByDate = function(item) {
        var date = new Date(item.fecha);

        return date;
    };

    $scope.orderFcn = $scope.orderByDate;

    $scope.verEntrada = function(entradaId){
    	adminserv.setSeleccion(entradaId);
    	$state.go('detail')
    }

    $scope.nuevaEntrada = function(){
        $state.go('entry')
    }

    $scope.setOrder = function(str){
        $scope.orderStr = str;
    }

    $scope.logout = function(){
        adminserv.logoutUser();
        $state.go('login');
    }
}])