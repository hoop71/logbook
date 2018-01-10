'use strict';
 
angular.module('logbookweb.dashboard', ['ui.router'])
 
// Declared route 
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('dashboard', {
		url: '/dashboard',
		templateUrl:'assets/pages/dashboard/dashboard.html',
		controller: 'dashboardCtrl',
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




.controller('dashboardCtrl', ['$scope','$state','adminserv', 'MENU_ITEMS','CHART_CONF', 'Auth', 'firebase', '$firebaseObject', '$firebaseArray','constDirectrices', 'dataCruncher', function($scope, $state, adminserv, MENU_ITEMS, CHART_CONF, Auth, firebase, $firebaseObject, $firebaseArray, constDirectrices, dataCruncher) {
	//js
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
	$scope.menuItems[0].class="active";

	$scope.today = new Date();
	$scope.entriesByYear = [[],[],[],[],[]];
	$scope.anoresDates = [];


	$scope.selectedStep = [true, false, false, false, false];
	$scope.stepClasses = ["active", "", "", "", ""];

	$scope.colors = ['#ab47bc', '#26c6da', '#ffa726', '#F1C40F']

	function monthDiff(d1, d2) {
	    var months;
	    months = (d2.getFullYear() - d1.getFullYear()) * 12;
	    months -= d1.getMonth() + 1;
	    months += d2.getMonth();
	    return months <= 0 ? 0 : months;
	}

	var userId = adminserv.getUser();

	var refUsuario = firebase.database().ref('users/'+userId);
	var objUsuario = $firebaseObject(refUsuario);
	objUsuario.$loaded().then(function(){
		$scope.user = objUsuario;
		$scope.fechainicio = new Date(objUsuario.fechainicio);
		$scope.currentAnores = adminserv.getAnores($scope.fechainicio, $scope.today);
		var d1 = new Date(objUsuario.fechainicio);
		var d2 = new Date(d1.getFullYear()+1, d1.getMonth(), d1.getDate())
		var d3 = new Date(d1.getFullYear()+2, d1.getMonth(), d1.getDate())
		var d4 = new Date(d1.getFullYear()+3, d1.getMonth(), d1.getDate())
		$scope.anoresDates = [d1,d1,d2,d3,d4];
		$scope.monthsAnores = monthDiff($scope.anoresDates[$scope.currentAnores-1],$scope.today)
	})

	var refEntries = firebase.database().ref('entradas/'+userId);
	var listEntries = $firebaseArray(refEntries);
	listEntries.$loaded().then(function(){
		$scope.dashData = dataCruncher.getDashboardData($scope.user, listEntries);
		$scope.data = $scope.dashData.general.barsByYearData;
		console.log($scope.dashData)
	})

	$scope.changeToStep = function(step){
		$scope.selectedStep = [false, false, false, false, false];
		$scope.selectedStep[step-1] = true;
		$scope.stepClasses = ["","","","",""];
		$scope.stepClasses[step-1] = "active"
		$.material.init();
	}

	$scope.logout = function(){
		adminserv.logoutUser();
		$state.go('login');
	}
	$scope.subirDirectrices = function(){
		var refDir = firebase.database().ref('constantes/directrices');
		var listDir = $firebaseArray(refDir);
		var directrices = constDirectrices
		listDir.$loaded().then(function(){
			for (var i = directrices.length - 1; i >= 0; i--) {
				listDir.$add(directrices[i]);
			}
			console.log("listo")
		})
	}	
//INTENTOS!!!
	 $scope.onClick = function (points, evt) {
	   console.log(points, evt);
	 };
	 $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
	 $scope.options = CHART_CONF.options;
	 $scope.options2 = CHART_CONF ;
	 $scope.optionsHor = CHART_CONF.optionsHorizontal;

	 $scope.labels = ['R1', 'R2', 'R3', 'R4'];
	  $scope.series = ['Series A'];
	  $scope.colours = ['rgba(255,255,255,1)', '#3498DB', '#717984', '#F1C40F'];
	  

	  
}])