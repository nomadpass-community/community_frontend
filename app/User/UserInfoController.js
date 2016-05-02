'use strict';

//UserInfoController.js
angular.module('myApp').controller("UserInfoController",['$rootScope', '$scope', '$window', 'auth', 'usersService', 'mapService', function($rootScope, $scope, $window, auth, usersService, mapService) {
    $scope.auth = auth;
    $rootScope.auth = auth;

    $rootScope.users = [];
    $rootScope.nomads = [];
    $rootScope.latValue = 0;
    $rootScope.lonValue = 0;
    $rootScope.idValue = 0;
    $rootScope.firstName = "";
    $rootScope.lastName = "";
    $rootScope.ip = 0;
    
    $rootScope.$on('auth0.authenticated', function($rootScope,e) {
        usersService.setupLoggedInUser($rootScope);
    });
    
    $rootScope = usersService.getUsersFromNomadPassAsync($rootScope);
}]);