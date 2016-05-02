'use strict';

//GuidesController.js
angular.module('myApp').controller('GuidesController', ['$scope', '$window', function($scope, $window, auth) {
    
    $scope.auth = auth;
    
    $scope.guides= [{
        "name" : "Bali",
        "subtitle" : "Survival Guide",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg"
    },{
        "name" : "San Francisco",
        "subtitle" : "Survival Guide",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg"
    },{
        "name" : "Jana Schuberth",
        "subtitle" : "30 Minute Free Coaching Session",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg"
    },{
        "name" : "Suitcase Entreprenuer",
        "subtitle" : "Free Nomad Starter Kit",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg"
    }];
    
}]);