'use strict';
var logbookweb = angular.module('logbookweb', [
    'ui.router',
    'logbookweb.login'
    ]);

logbookweb.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');

  
        
});


