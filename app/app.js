'use strict';

//var sharedServicesModule = angular.module('sharedServices',[]);
//sharedServices.service('NetworkService', function($http){});

//var loginModule = angular.module('login',['sharedServices']);
//loginModule.service('loginService', function(NetworkService){});
//loginModule.controller('loginController', function($scope, loginService){});

//var userModule = angular.module('users',[]);
//userModule.service('usersService', function(NetworkService){});
//userModule.controller('UserInfoController', function($scope, usersService){});

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
    //'sharedServices',
    //'login',
    //'users',
    'ngResource',
    'ngCookies',
    'ngRoute',
    //'ngSanitize',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'auth0',
    'angular-storage',
    'angular-jwt'
])
    .config(['$routeProvider', 'authProvider', '$locationProvider', 'jwtInterceptorProvider', '$httpProvider', function($routeProvider, authProvider, $locationProvider, jwtInterceptorProvider, $httpProvider) { //, '$resource', '$route'
      $routeProvider
          .when('/',{
            templateUrl:'map.html',
            controller: 'UserInfoController',
            requiresLogin: true
          })
          .when('/login',{
            templateUrl:'index.html',
            controller: 'LoginController'
          })
          .when('/map',{
            templateUrl:'map.html', //'Users/users.html',
            controller: 'UserInfoController',//UserController
            requiresLogin: true
          })
          .when('/guides',{
            templateUrl:'Guides/survivalGuides.html',
            controller: 'GuidesController',
            requiresLogin: true
          })
          .when('/profile',{
            templateUrl:'Profile/editProfile.html',
            controller: 'ProfileController',
            requiresLogin: true
          })
          .otherwise({
            redirectTo: '/app/'
          });
        
    authProvider.init({
        domain: 'nomadpass.auth0.com',
        clientID: 'NWD3UvYxjzGm2QN7nrShsp4W5ceB8Sa5',
        callbackURL: location.href,
        // Here include the URL to redirect to if the user tries to access a resource when not authenticated.
        loginUrl: '/app/'
    });
        
    authProvider.on('loginSuccess', function($location, $window, $route, profilePromise, idToken, store) {
        console.log("Login Success");
        profilePromise.then(function(profile) {
            store.set('profile', profile);
            store.set('token', idToken);
            
            $location.path('/app/map.html');
            $route.reload();
            console.log("Heading to map page..");
        });
        
        //$window.location.href = "/app/map.html";
    });
        
    //authProvider.on('authenticated', function($location) {
        // This is after a refresh of the page
        // If the user is still authenticated, you get this event
        //alert("Still Authenticated!");    
    //});
        
    authProvider.on('loginFailure', function() {
        // Error Callback
        alert("Login Failure: Please try again.");
        $location.path('/error');
    });      
}])
    .run(function($rootScope, auth, store, jwtHelper, $location) {
      // This events gets triggered on refresh or URL change
      $rootScope.$on('$locationChangeStart', function() {
        var token = store.get('token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            if (!auth.isAuthenticated) {
              auth.authenticate(store.get('profile'), token);
            }
          } else {
            // Either show the login page or use the refresh token to get a new idToken
            $location.path('/app/');
            auth.signin();
          }
        }
      });
    })
    .run(function(auth) {
      // This hooks all auth events to check everything as soon as the app starts
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
  
})
.run(function($rootScope, auth, store, jwtHelper, $location) {
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          $location.path('/app');
        }
      }
    }
  });
});
