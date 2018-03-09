angular.module('logbookweb.detailObj', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('detailObj', {
		url: '/detalleobjetivo',
		templateUrl:'assets/pages/detailobj/detailobj.html',
		controller: 'detailObjCtrl'
	})

}])

.controller('detailObjCtrl', ['adminserv','$scope','$state','$rootScope','$firebaseObject', 'MENU_ITEMS','errorHandler','SweetAlert', function(adminserv, $scope, $state, $rootScope, $firebaseObject, MENU_ITEMS, errorHandler, SweetAlert) {
	$scope.menuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
	$scope.menuItems[1].class="active"
	$scope.entradas = [];

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
	var seleccion = adminserv.getSeleccion();

	var refObj = firebase.database().ref('users/'+userId+'/objetivos/'+seleccion);
	var objObj = $firebaseObject(refObj);
	var fechainicio = new Date();
	objObj.$loaded().then(function(){
		$scope.objetivo = objObj
		var refsEnt = [];
		var objsEntr = [];
		if ($scope.objetivo.entradas) {
			for (var i = 0; i < $scope.objetivo.entradas.length; i++) {
				refsEnt[i] = firebase.database().ref('entradas/'+userId+'/'+$scope.objetivo.entradas[i]);
				objsEntr[i] = $firebaseObject(refsEnt[i]);
			}
			$scope.entradas = objsEntr;
		}
		
	});

	$scope.getProgress = function(currentAmt, total){
		var progress = Math.round((currentAmt/total)*100)
		var progressStr = progress.toString() + "%";
		return {width: progressStr}
	}

	$scope.startDelete = function(){
		swal({
			title: 'estás seguro?',
			text: "al borrar esta entrada se perderá toda la información y no se podrá recuperar",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, bórrala!',
			cancelButtonText: 'No, no la borres'
		}).then((result) => {
			if (result) {
				$scope.objetivo.$remove().then(function(ref) {
					$state.go('objectives');
				}, function(error) {
				
				});
			}
		})
	}
}])