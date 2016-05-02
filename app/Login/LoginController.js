'use strict';

//LoginController.js
angular.module('myApp').controller( 'LoginController', ['$scope', 'auth', 'store', '$window', '$location', function ($scope, auth, store, $window, $location) {

    $scope.auth = auth;
    $scope.profile = auth.profile;
    
    $scope.logout = function() {
        auth.signout();
        store.remove('profile');
        store.remove('token');
        //document.getElementById("logoutBtn").style.display="none";
        //document.getElementById("loginBtn").style.display="";  
        
        $location.path('/app/');
        //$window.location.href = 'http://www.nomadpass.com/index.php/';
    }

}]);