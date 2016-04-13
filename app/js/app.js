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

var idValue = "";
var latValue;
var lonValue;
var firstName = "";
var lastName = "";
var ip = "";

var data1;
var data2;
var data3;
var data4;
var url = "";
var tokens = [];
var token1 = [];
var token2 = [];
var token3 = [];
var token4 = [];

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function getUsersFromNomadPassAsync(){
    var token = $.Deferred();
    getUsers(function(){
        //resolve the token once the async operation is complete
        token.resolve();
    });
    return token.promise();
};

function getUsers(callback){
  setTimeout(function(){  
    // Look for this user in Nomad Pass. If we do have them, just return their nomadId
    var url1 = "http://api-80-145420987.us-west-1.elb.amazonaws.com/nomads";
    var xhr1 = createCORSRequest('GET', url1);
    if (!xhr1) {
      throw new Error('CORS not supported');
    }
    xhr1.send();

    xhr1.addEventListener("readystatechange", processRequest1, false); 

    // Get back the response, check for matching name
    function processRequest1(e) {
        if (xhr1.readyState == 4 && xhr1.status == 200) {
            var response = JSON.parse(xhr1.responseText);
            for(var i = 0; i < response.length; i++) {
                if(response[i].first_name == firstName && response[i].last_name == lastName){
                    idValue = response[i].id;
                    console.log("Found id " + idValue);  
                        tokens.push(1);
                        console.log("completed user search with id " + idValue + " " + tokens.length);
                  checkinLatestLocation();
                  break;
                }
            }
            if(idValue == "" && firstName != "" && lastName != ""){ 
                console.log("Didn't Find Id, will create new NP User");
                //Create a new user from the user data in Auth0, and then get the returned nomadId.
                token2.push(createNomadAsync());  
            }
            callback();
        }
    }  
  }, 5000);
};

function createNomadAsync() {
    var tokena = $.Deferred();
    createNomadAndReturnNomadId(function(){
        //resolve the token once the async operation is complete
        tokena.resolve();
    });
    return tokena.promise();
};   

function createNomadAndReturnNomadId(callback){
    setTimeout(function(){
        data2 = JSON.stringify({ 
          "first_name": String(firstName), 
          "last_name": String(lastName)
        });

        // construct an HTTP request and send to Nomad Pass API
        console.log("Creating new nomad id for " + firstName + " " + lastName);
        var url2 = "http://api-80-145420987.us-west-1.elb.amazonaws.com/nomads";
        var xhr2 = createCORSRequest('POST', url2);
        if (!xhr2) {
          throw new Error('CORS not supported');
        }
        xhr2.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr2.setRequestHeader('Preference-Applied', 'return=representation');
        xhr2.send(data2);
        console.log("Created Nomad");
        
        token1.push(getUsersFromNomadPassAsync());
        
        callback();
    }, 5000);
};

function getIpAsync() {
    var tokenb = $.Deferred();
    getIpAddress(function(){
        //resolve the token once the async operation is complete
        tokenb.resolve();
    });
    return tokenb.promise();
};

function getIpAddress(callback){
    setTimeout(function(){
      var url3 = "http://jsonip.com";
      var xhr3 = createCORSRequest('GET', url3);
      if (!xhr3) {
        throw new Error('CORS not supported');
      }    
      xhr3.send();
        
      xhr3.addEventListener("readystatechange", processRequest3, false);     
        
      function processRequest3(e) {
          if (xhr3.readyState == 4 && xhr3.status == 200) {
            var response = JSON.parse(xhr3.responseText);
            ip = String(response.ip);  
              tokens.push(1);
              console.log("searched ip: " + ip + " " + tokens.length);
              token4.push(getLatAndLonAsync());
          }
        }   
      callback();    
    }, 5000);
};

function getLatAndLonAsync() {
    var tokenc = $.Deferred();
    getLatitudeAndLongitude(function() {
        //resolve the token once the async operation is complete
        tokenc.resolve();
    });
    return tokenc.promise();
};

function getLatitudeAndLongitude(callback){
    setTimeout(function(){
      //Use the ip address to estimate the user's latitude and longitude
      console.log("Got ip: " + String(ip) + " Getting lat and lon...");    
      data4 = JSON.stringify({
          "ip": String(ip)
      });
      var url4 = "http://api-80-145420987.us-west-1.elb.amazonaws.com/rpc/where_is";
      var xhr4 = createCORSRequest('POST', url4);
      if (!xhr4) {
        throw new Error('CORS not supported');
      }
      xhr4.setRequestHeader('Preference-Applied', 'return=representation');
      xhr4.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr4.send(data4);
        
      xhr4.addEventListener("readystatechange", processRequest4, false);     

      // Get back the latitude and longitude
      function processRequest4(e) {
          if (xhr4.readyState == 4 && xhr4.status == 200) {
              var response = JSON.parse(xhr4.responseText);
              latValue = response[0].latitude;  
              lonValue = response[0].longitude;  
              tokens.push(1);
              console.log("Completed lat " + latValue + " lon " + lonValue + " " + tokens.length);
              //Look for logged in user in Nomad Pass
              token1.push(getUsersFromNomadPassAsync());
          }
      }
      callback();
    }, 5000);
};

function MainAsyncFunction(callback){
      // if ip not available in auth0 profile, get it before geting lat and lon
      if (ip == ""){
          console.log("No Ip from Start");
          token3.push(getIpAsync());
      }
      else{ // get latitude and logitude from auth0 profile ip
          console.log("Ip from auth0 is " + ip);
          token4.push(getLatAndLonAsync());
      }
};

function checkinLatestLocation(){
    //once ALL the sub operations are completed, this callback will be invoked
    console.log("Final Push!");
    console.log(idValue);
    console.log(latValue);
    console.log(lonValue);
    console.log(firstName);
    console.log(lastName);
    console.log(ip);

    //Use the nomadId, latitude, and longitude create a checkin for the user
    data3 = JSON.stringify({ 
        'nomad_id': idValue, 
        'lat': latValue, 
        'lon': lonValue 
    });
    var url5 = "http://api-80-145420987.us-west-1.elb.amazonaws.com/checkins";
    var xhr5 = createCORSRequest('POST', url5);
        if (!xhr5) {
            throw new Error('CORS not supported');
        }
    xhr5.setRequestHeader('Preference-Applied', 'return=representation');
    xhr5.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr5.send(data3);

    alert("Welcome to Nomad Pass Community, " + firstName + " "+ lastName + "!");
}

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
        $location.path('/app/');
        firstName = profile.given_name;
        lastName = profile.family_name;
        if (typeof ip == String){
            ip = profile.last_ip;
        }    
      });
      
      MainAsyncFunction();
  });

  authProvider.on('loginFailure', function() {
       // Error Callback
      alert("Login Failure: Please try again.")
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