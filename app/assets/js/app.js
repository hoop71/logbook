
'use strict';

var logbookweb = angular.module('logbookweb', [
    'ui.router',
    'firebase',
    'logbookweb.login',
    'logbookweb.signup',
    'logbookweb.dashboard',
    'logbookweb.table',
    'logbookweb.profile',
    'logbookweb.entry'


    ]);

logbookweb.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');

  	
        
});

logbookweb.service('adminserv',['$firebaseArray','$rootScope','Auth','$http', function($firebaseArray,$rootScope,Auth, $http) {

}]);


logbookweb.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

logbookweb.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("login");
    }
  });
}]);


