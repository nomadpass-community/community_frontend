'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngResource',
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'auth0',
  'angular-storage',
  'angular-jwt'
])
    .config(['$routeProvider', function($routeProvider, authProvider, $locationProvider, jwtInterceptorProvider, $httpProvider, $resource) {
      $routeProvider
          .when('/item',{
            templateUrl:'/templates/item.html',
            controller: 'ItemController'
          })
          .when('/login',{
            templateUrl:'templates/login.html',
            controller: 'LoginController'
          })
          .otherwise({
            redirectTo: '/index.html'
          });
    }]);

myApp.config(function(authProvider){
  authProvider.init({
    domain: 'nomadpass.auth0.com',
    clientID: 'NWD3UvYxjzGm2QN7nrShsp4W5ceB8Sa5'
  });
  authProvider.on('loginSuccess', function($location, profilePromise, idToken, store) {
      console.log("Login Success");
      profilePromise.then(function(profile) {
        store.set('profile', profile);
        store.set('token', idToken);
      });
      $location.path('/');
      
      // collect the user data from Auth0
      var data = { 
          'first_name': profile.given_name, 
          'last_name': profile.family_name
      }
      
      // construct an HTTP request and send to Nomad Pass API
      var url = "http://api-80-145420987.us-west-1.elb.amazonaws.com/nomads";
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.setRequestHeader('Preference-Applied', 'return=representation');
      xhr.send(JSON.stringify(data));
      
      // Get back the nomadId
      xmlDoc = xhr.responseXML;
      idValue = "";
      x = xmlDoc.getElementsByTagName("nomad_id");
      for (i = 0; i < x.length; i++) {
          txt += x[i].childNodes[0].nodeValue + "<br>";
      }
      //document.getElementById("nomadId").innerHTML = idValue;

      xhr.onloadend = function () {
        // done
      };
      
      // get ip, if not available in auth0 profile 
      ip = "";
      $.getJSON('http://jsonip.com',
        function(data){
          alert(data.ip);
          ip = data.ip;
        });
      
      //Use the returned ip address to estimate the user's latitude and longitude
      data = {
          'ip': profile.last_ip //ip;
      }
      url = "http://api-80-145420987.us-west-1.elb.amazonaws.com/rpc/where_is";
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Preference-Applied', 'return=representation');
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.send(JSON.stringify(data));
      
      //// Get back the latitude and longitude
      xmlDoc = xhr.responseXML;
      latValue = "";
      lonValue = "";
      x = xmlDoc.getElementsByTagName("lat");
      for (i = 0; i < x.length; i++) {
          latValue += x[i].childNodes[0].nodeValue + "<br>";
      }
      //document.getElementById("lat").innerHTML = latValue;
      x = xmlDoc.getElementsByTagName("lon");
      for (i = 0; i < x.length; i++) {
          lonValue += x[i].childNodes[0].nodeValue + "<br>";
      }
      //document.getElementById("lon").innerHTML = lonValue;
      
      
      //Use the nomadId, latitude, and longitude create a checkin for the user
      data = { 
          'nomad_id': idValue, 
          'lat': latValue, 
          'lon': lonValue 
      }
      url = "http://api-80-145420987.us-west-1.elb.amazonaws.com/checkins";
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Preference-Applied', 'return=representation');
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.send(JSON.stringify(data));
      
  });

  authProvider.on('loginFailure', function() {
       // Error Callback
  });  
})
.run(function(auth) {
  // This hooks al auth events to check everything as soon as the app starts
  auth.hookEvents();
});

myApp.config(['$locationProvider',function($locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);    

myApp.config(function (authProvider, $routeProvider, $httpProvider, jwtInterceptorProvider) {
  // ...

  // We're annotating this function so that the `store` is injected correctly when this file is minified
  jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    // Return the saved token
    return store.get('token');
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
  // ...
});
