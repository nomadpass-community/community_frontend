'use strict';

//MapController.js
angular.module('myApp').controller("MapController",['$rootScope', '$scope', '$window', 'mapService', 'auth', function($rootScope, $scope, $window, mapService, auth) {
    $scope.auth = auth;
    $rootScope.user = auth.profile;
    
    
    /*$scope.users= [{
        "firstName" : "Jack",
        "jobTitle" : "CEO of Previously Awesome Company Place",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg",
        "cityName" : "Los Angeles",
        "latValue" : 37.7,
        "lonValue" : -122.5
    },{
        "firstName" : "Raiden",
        "jobTitle" : "Cyborg Mercenary",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg",
        "cityName" : "San Diego",
        "latValue" : 37.8,
        "lonValue" : -122.4
    },{
        "firstName" : "Christopher",
        "jobTitle" : "Unnecessarily Long Previous Job Title Description",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg",
        "cityName" : "Boulder",
        "latValue" : 37.6,
        "lonValue" : -122.4
    },{
        "firstName" : "Jack",
        "jobTitle" : "The Ripper",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg",
        "cityName" : "Washington",
        "latValue" : 37.7,
        "lonValue" : -122.4
    }];*/
    
    //If we have lat and lon, setup map with them. Otherwise, just use SF coordinates
    /*if (typeof $scope.latValue !== 'undefined') {
        if(typeof $rootScope.users !== 'undefined') window.setTimeout(mapService.setupMap($scope, $scope.latValue, $scope.lonValue, $rootScope.users), 50000); //$scope = mapService.setupMap($scope, $scope.latValue, $scope.lonValue, $rootScope.users);
        else $scope = mapService.setupMap($scope, $scope.latValue, $scope.lonValue, []);
    }
    else $scope = mapService.setupMap($scope, 37.7749, -122.4194, []);
    */
}]);
