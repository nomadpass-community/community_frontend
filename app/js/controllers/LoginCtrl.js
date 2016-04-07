// LoginCtrl.js
angular.module('myApp').controller( 'LoginCtrl', function ( $scope, auth) {

  $scope.auth = auth;
    
  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
  }

});