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




.controller('dashboardCtrl', ['$scope','$state','adminserv', 'MENU_ITEMS', 'Auth', 'firebase', '$firebaseObject', '$firebaseArray','constDirectrices', function($scope, $state, adminserv, MENU_ITEMS, Auth, firebase, $firebaseObject, $firebaseArray, constDirectrices) {
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
		console.log($scope.anoresDates)
		$scope.monthsAnores = monthDiff($scope.anoresDates[$scope.currentAnores-1],$scope.today)
	})

	var refEntries = firebase.database().ref('entradas/'+userId);
	var listEntries = $firebaseArray(refEntries);
	listEntries.$loaded().then(function(){
		$scope.entries = listEntries;
		for (var entry of $scope.entries) {
		 	if (entry.anores>=0) {
		 		$scope.entriesByYear[entry.anores].push(entry)
		 	}
		}
		demo.initDashboardPageCharts();
		var mydataDailySalesChart = {
            labels: ['R1', 'R2', 'R3', 'R4'],
            series: [
                [ $scope.entriesByYear[1].length, $scope.entriesByYear[2].length, $scope.entriesByYear[3].length, $scope.entriesByYear[4].length]
            ]
        };
		var dailySalesChart = new Chartist.Bar('#dailySalesChart', mydataDailySalesChart, optionsDailySalesChart);
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
}])