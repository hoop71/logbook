
'use strict';

var logbookweb = angular.module('logbookweb', [
    'ui.router',
    'logbookweb.login',
    'logbookweb.signup',
    'logbookweb.dashboard',
    'logbookweb.table'


    ]);

logbookweb.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');

  
        
});
