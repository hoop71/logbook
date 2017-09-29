
'use strict';

var logbookweb = angular.module('logbookweb', [
    'ui.router',
    'logbookweb.login',
    'logbookweb.signup',
    'logbookweb.dashboard'


    ]);

logbookweb.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');

  
        
});
