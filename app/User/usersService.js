'use strict';

angular.module('myApp').service('usersService', ['$rootScope', 'auth', 'mapService', function($rootScope, auth, mapService){
   var service = {
       
       setupLoggedInUser : function($rootScope){
            $rootScope.firstName = auth.profile.given_name;
            $rootScope.lastName = auth.profile.family_name;
            $rootScope.jobTitle = auth.profile.headline;
            $rootScope.profilePicUrl = auth.profile.picture;
            if (typeof $rootScope.ip !== 'undefined'){
                $rootScope.ip = auth.profile.last_ip;
            }
            console.log("Setup Logged in User: " + $rootScope.firstName);
           
            this.MainAsyncFunction($rootScope);
            this.getUsersFromNomadPassAsync($rootScope);
        },
       
       MainAsyncFunction : function($rootScope, callback){
            // if ip not available in auth0 profile, get it before geting lat and lon
            if (typeof $rootScope.ip === 'undefined'){
              console.log("No Ip from Start");
              this.getIpAsync($rootScope);
            }
            else{ // get latitude and logitude from auth0 profile ip
              console.log("Ip from auth0 is " + $rootScope.ip);
              getLatAndLonAsync($rootScope);
            }
        },

        abbreviateCity : function(str) {
          var cityAbbreviated = "";
          var len=str.length;
          for(var i=0;i<len;i++) {
            if(/[A-Z]/.test(str.charAt(i))){
                cityAbbreviated+=str.charAt(i);
                if (cityAbbreviated.length == 2) break;
            } 
          }
          if(cityAbbreviated.length != 2){
              cityAbbreviated = str.charAt(0).toUpperCase() + str.charAt(1).toUpperCase();
          }    
          return cityAbbreviated;
        },

        getUsersFromNomadPassAsync : function($rootScope){
            var token = $.Deferred();
            this.getAllUsers($rootScope,function(){
                //resolve the token once the async operation is complete
                token.resolve();
            });
            return token.promise();
        },

        getAllUsers : function($rootScope,callback){
          setTimeout(function(){  
            // Look for this user in Nomad Pass. If we do have them, just return their nomadId
            var url1 = "http://api-80-145420987.us-west-1.elb.amazonaws.com/nomads";
            var xhr1 = createCORSRequest('GET', url1);
            if (!xhr1) {
              throw new Error('CORS not supported');
            }
            xhr1.send();

            xhr1.addEventListener("readystatechange", processRequest1, false); 

            function processRequest1(e) {
                if (xhr1.readyState == 4 && xhr1.status == 200) {
                    var response = JSON.parse(xhr1.responseText);

                    //Use all returned data to show nearby nomad profiles and map pins
                    $rootScope.users = setListOfNearbyNomadPasses(response); //setFakeUsers(response);
                    var newUsers = setListOfNearbyNomadPasses(response); 
                    for(var i=0;i<newUsers.length;i++){
                        if($rootScope.nomads) $rootScope.nomads.push(newUsers[i]);
                    }
                    
                    //this.getCheckinsFromNomadPassAsync($rootScope);
                    
                    checkUsersForLoggedInUser($rootScope, response);
                    
                    $rootScope.$apply(); //TODO: this breaks sometimes
                    
                    callback();
                } else {
                    console.log("ProcessRequest4: readyState = " + xhr1.readyState + "; status = " + xhr1.status);
                }
            }    
          }, 5000);
        return $rootScope; 
        },
       
        getCheckinsFromNomadPassAsync : function($rootScope){
            var tokene = $.Deferred();
            this.getAllCheckins($rootScope,function(){
                //resolve the token once the async operation is complete
                tokene.resolve();
            });
            return tokene.promise();
        },

        getAllCheckins : function($rootScope,callback){
          setTimeout(function(){  
            // Look for this user in Nomad Pass. If we do have them, just return their nomadId
            var url5 = "http://api-80-145420987.us-west-1.elb.amazonaws.com/checkins";
            var xhr5 = createCORSRequest('GET', url5);
            if (!xhr5) {
              throw new Error('CORS not supported');
            }
            xhr5.send();

            xhr5.addEventListener("readystatechange", processRequest5, false); 

            function processRequest5(e) {
                if (xhr5.readyState == 4 && xhr5.status == 200) {
                    var response = JSON.parse(xhr5.responseText);

                    //Use all returned data to show nearby nomad profiles and map pins
                    $rootScope.users = setLocationsOfNearbyNomadPasses(response);
                    
                    $rootScope.$apply(); //TODO: this breaks sometimes
                    
                    callback();
                } else {
                    console.log("ProcessRequest5: readyState = " + xhr5.readyState + "; status = " + xhr5.status);
                }
            }    
          }, 5000);
        return $rootScope; 
        },
       
        

        getIpAsync : function($rootScope) {
            var tokenb = $.Deferred();
            this.getIpAddress($rootScope,function(){
                //resolve the token once the async operation is complete
                tokenb.resolve();
            });
            return tokenb.promise();
        },

        getIpAddress : function($rootScope,callback){
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
                    $rootScope.ip = String(response.ip); 
                    console.log("Found ip: " + $rootScope.ip );
                  }
                  else{
                    console.log("ProcessRequest3: readyState = " + xhr3.readyState + "; status = " + xhr3.status);
                  }
              }
              this.getLatAndLonAsync($rootScope);    
              callback();    
            }, 5000);
        },

        /*getLatAndLonAsync : function($rootScope) { //NOT CALLED
            var tokenc = $.Deferred();
            console.log("getLatLonAsync SERVICE Logged in User: " + $rootScope.firstName);
            this.getLatitudeAndLongitude($rootScope,function() {
                //resolve the token once the async operation is complete
                tokenc.resolve();
            });
            return tokenc.promise();
        },

        getLatitudeAndLongitude : function($rootScope,mapService,callback){ //NOT BEING CALLED
            setTimeout(function(){
              //Use the ip address to estimate the user's latitude and longitude
              console.log("Got ip: " + String($rootScope.ip) + " Getting lat and lon...");    
              var data4 = JSON.stringify({
                  "ip": String($rootScope.ip)
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
                      $rootScope.latValue = response[0].latitude;  
                      $rootScope.lonValue = response[0].longitude;  
                      $rootScope.$apply();
                      console.log("Determined lat " + $rootScope.latValue + " and lon " + $rootScope.lonValue);

                      setupMap($rootScope.users, response[0].latitude, response[0].longitude);  
                      console.log("Map setup complete yo.");
                  }
                  else{
                    console.log("ProcessRequest4: readyState = " + xhr4.readyState + "; status = " + xhr4.status);
                  }
              }
              callback();
            }, 5000);
        },
       
       setupMap : function(users, latValue, lonValue){ // NOT CALLED
            //Hide the placeholder map, and show the real map
            document.getElementById("map").style.display="none";
            document.getElementById("mapid").style.display="";
           
            var mymap = L.map('mapid').setView([latValue, lonValue], 11);
            var myIcon = L.icon({
                iconUrl: '/app/img/nomadPassPin.png',
                iconSize: [45, 50]
            });
            mymap.scrollWheelZoom.disable();
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: '',
                maxZoom: 18,
                style: 'mapbox://styles/hendrixsan/cin5p9ssh00quc9mawumarwdk',
                id: 'mapbox.satellite',
                accessToken: 'pk.eyJ1IjoiaGVuZHJpeHNhbiIsImEiOiJjaW16d3JqaHYwNjE4dXdtNGsxdWNydGloIn0.p8IwV2k5h36nf7p-TgxtUA'
            }).addTo(mymap);  
            //var myMarker = L.marker([latValue, lonValue], {icon: myIcon}).addTo(mymap);
            
            //If we have other users, put them on the map
            console.log("Checking for other users, dude...");
            if (typeof users !== 'undefined'){
                for(var i=0; i<users.length; i++){
                    var nomadMarker = L.marker([users[i].latValue, users[i].lonValue], {icon: myIcon}).addTo(mymap);
                    console.log("Added user:" + users[i].firstName);
                } 
            }
        },
       
       checkinLatestLocation : function($rootScope){
            //once ALL the sub operations are completed, this callback will be invoked
            console.log("Checking In User");
            console.log($rootScope.idValue);
            console.log($rootScope.latValue);
            console.log($rootScope.lonValue);
            console.log($rootScope.firstName);
            console.log($rootScope.lastName);
            console.log($rootScope.ip);

            //Use the nomadId, latitude, and longitude create a checkin for the user
            var data3 = JSON.stringify({ 
                'nomad_id': $rootScope.idValue, 
                'lat': $rootScope.latValue, 
                'lon': $rootScope.lonValue 
            });
            var url5 = "http://api-80-145420987.us-west-1.elb.amazonaws.com/checkins";
            var xhr5 = createCORSRequest('POST', url5);
                if (!xhr5) {
                    throw new Error('CORS not supported');
                }
            xhr5.setRequestHeader('Preference-Applied', 'return=representation');
            xhr5.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr5.send(data3);
        }*/
   }
   
   return service;
}]);

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
};

function checkUsersForLoggedInUser($rootScope, response){
    //Check for a matching name, if found get that id
    for(var i = 0; i < response.length; i++) {
        console.log("Searching: " + $rootScope.firstName + " compared to " + response[i].first_name);
        if(response[i].first_name == $rootScope.firstName && response[i].last_name == $rootScope.lastName){
            $rootScope.idValue = response[i].id;
            //$rootScope.$apply();
            console.log("Finished dat user search with id " + $rootScope.idValue);
            break;
        }
    }
    //If no match is found, create a new id
    if($rootScope.idValue == "" && $rootScope.firstName != "" && $rootScope.lastName != ""){ 
        console.log("Didn't Find Id, will create new NP User");
        //Create a new user from the user data in Auth0, and then get the returned nomadId.
        createNomadAsync($rootScope);  
    }  
};

function createNomadAsync($rootScope) {
    var tokena = $.Deferred();
    createNomadAndReturnNomadId($rootScope,function(){
        //resolve the token once the async operation is complete
        tokena.resolve();
    });
    return tokena.promise();
};

function createNomadAndReturnNomadId($rootScope,callback){
    setTimeout(function(){
        var data2 = JSON.stringify({ 
          "first_name": String($rootScope.firstName), 
          "last_name": String($rootScope.lastName)
        });

        // construct an HTTP request and send to Nomad Pass API
        console.log("Creating new nomad id for " + $rootScope.firstName + " " + $rootScope.lastName);
        var url2 = "http://api-80-145420987.us-west-1.elb.amazonaws.com/nomads";
        var xhr2 = createCORSRequest('POST', url2);
        if (!xhr2) {
          throw new Error('CORS not supported');
        }
        xhr2.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr2.setRequestHeader('Preference-Applied', 'return=representation');
        xhr2.send(data2);
        console.log("Created Nomad");

        getUsersFromNomadPassAsync($rootScope);

        callback();
    }, 5000);
};


function setLocationsOfNearbyNomadPasses(response){
    var users = [];
    console.log("Setting Nearby Nomads Locations...");
    for(var i=0;i<response.length;i++)
    {
        //TODO: go through the response and check for duplicate nomad_id values, grab the lat and lon of the most recently created nomad_id
        //For each nomad_id, find the matching id in $rootScope.nomads/$rootScope.users and set the cityName, cityAbbreviation, latValue, and lonValue
        var user = {
            'cityName' : "Los Angeles", //need to add to /checkins response.city_name
            'cityAbbreviation' : "LA", // abbreviateCity(response.city_name)
            'latValue' : 50, //from /checkins response.lat
            'lonValue' : 3 //from /checkins response.lon
        }; 
        users.push(user);  
        console.log("Entry " + i + " complete. " + users[i].firstName + " " + users[i].lastName);
    }
    console.log("Done Setting Nearby Nomads Locations.");
    return users;
};

function setListOfNearbyNomadPasses(response){
    var users = [];
    for(var i=0;i<response.length;i++)
    {
        var user = {
            'id' : response[i].id,
            'firstName' : response[i].first_name,
            'lastName' : response[i].last_name,
            'jobTitle' : "CEO",// need to add to /nomads response.jobTitle,
            'profilePicUrl' : "https://flattr.com/images/profile-image-placeholder.png", //need to add to /nomads response.profilePicUrl
            'cityName' : "Los Angeles", //need to add to /checkins response.city_name
            'cityAbbreviation' : "LA", // abbreviateCity(response.city_name)
            'latValue' : 50, //from /checkins response.lat
            'lonValue' : 3 //from /checkins response.lon
        }; 
        users.push(user);  
        console.log("Entry " + i + " complete. " + users[i].firstName + " " + users[i].lastName);
    }
    console.log("Done Setting Nearby Nomads.");
    return users;
};

function setFakeUsers(response){
  var fakeUsers = [{
        "firstName" : "John",
        "jobTitle" : "CEO of Previously Awesome Company Place",
        "profilePicUrl" : "https://flattr.com/images/profile-image-placeholder.png",
        "cityName" : "Los Angeles",
        "cityAbbreviation" : abbreviateCity("Los Angeles"),
        "latValue" : 37.7,
        "lonValue" : -122.5
    },{
        "firstName" : "Raiden",
        "jobTitle" : "Cyborg Mercenary",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg",
        "cityName" : "San Diego",
        "cityAbbreviation" : abbreviateCity("San Diego"),
        "latValue" : 37.8,
        "lonValue" : -122.4
    },{
        "firstName" : "Christopher",
        "jobTitle" : "Unnecessarily Long Previous Job Title Description",
        "profilePicUrl" : "https://flattr.com/images/profile-image-placeholder.png",
        "cityName" : "Boulder",
        "cityAbbreviation" : abbreviateCity("Boulder"),
        "latValue" : 37.6,
        "lonValue" : -122.4
    },{
        "firstName" : "Jack",
        "jobTitle" : "The Ripper",
        "profilePicUrl" : "https://i.ytimg.com/vi/j-fPDu5vqRc/maxresdefault.jpg",
        "cityName" : "Washington",
        "cityAbbreviation" : abbreviateCity("Washington"),
        "latValue" : 37.7,
        "lonValue" : -122.4
    }];
   return fakeUsers;
};

function abbreviateCity(str) {
          var cityAbbreviated = "";
          var len=str.length;
          for(var i=0;i<len;i++) {
            if(/[A-Z]/.test(str.charAt(i))){
                cityAbbreviated+=str.charAt(i);
                if (cityAbbreviated.length == 2) break;
            } 
          }
          if(cityAbbreviated.length != 2){
              cityAbbreviated = str.charAt(0).toUpperCase() + str.charAt(1).toUpperCase();
          }    
          return cityAbbreviated;
        };

function getIpAsync($rootScope) {
    var tokenb = $.Deferred();
    this.getIpAddress($rootScope,function(){
        //resolve the token once the async operation is complete
        tokenb.resolve();
    });
    return tokenb.promise();
};

function getIpAddress($rootScope,callback){
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
            $rootScope.ip = String(response.ip);  
              console.log("searched ip: " + $rootScope.ip);
              parent.getLatAndLonAsync($rootScope);
          }
          else{
            console.log("ProcessRequest3: readyState = " + xhr3.readyState + "; status = " + xhr3.status);
          }
        }   
      callback();    
    }, 5000);
};

function getLatAndLonAsync($rootScope) {
    var tokenc = $.Deferred();
    this.getLatitudeAndLongitude($rootScope,function() {
        //resolve the token once the async operation is complete
        tokenc.resolve();
    });
    return tokenc.promise();
};

function getLatitudeAndLongitude($rootScope,callback){ 
    setTimeout(function(){
      //Use the ip address to estimate the user's latitude and longitude
      console.log("Got ip: " + String($rootScope.ip) + " Getting lat and lon...");    
      var data4 = JSON.stringify({
          "ip": String($rootScope.ip)
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
              $rootScope.latValue = response[0].latitude;  
              $rootScope.lonValue = response[0].longitude;
              console.log("Calculated lat " + $rootScope.latValue + " lon " + $rootScope.lonValue);
              
              parent.setupMap($rootScope, response[0].latitude, response[0].longitude);
          }
          else{
            console.log("ProcessRequest4: readyState = " + xhr4.readyState + "; status = " + xhr4.status);
          }
      }
      callback();
    }, 5000);
};

function setupMap($rootScope, latValue, lonValue){
    //Hide the placeholder map, and show the real map
    document.getElementById("map").style.display="none";
    document.getElementById("mapid").style.display="";

    var mymap = L.map('mapid').setView([latValue, lonValue], 5);
    var myIcon = L.icon({
        iconUrl: '/app/img/nomadPassPin.png',
        iconSize: [45, 50]
    });
    mymap.scrollWheelZoom.disable();
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: '',
        maxZoom: 18,
        style: 'mapbox://styles/hendrixsan/cin5p9ssh00quc9mawumarwdk',
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoiaGVuZHJpeHNhbiIsImEiOiJjaW16d3JqaHYwNjE4dXdtNGsxdWNydGloIn0.p8IwV2k5h36nf7p-TgxtUA'
    }).addTo(mymap);  
    var myMarker = L.marker([latValue, lonValue], {icon: myIcon}).addTo(mymap);

    //If we have other users, put them on the map
    if (typeof $rootScope.users !== 'undefined'){
        for(var i=0; i<$rootScope.users.length; i++){
            var nomadMarker = L.marker([$rootScope.users[i].latValue, $rootScope.users[i].lonValue], {icon: myIcon}).addTo(mymap);
            console.log("Added nomad to Map: " + $rootScope.users[i].firstName);
        } 
    }
    
    checkinLatestLocation($rootScope);
};

function checkinLatestLocation($rootScope){
    //once ALL the sub operations are completed, this callback will be invoked
    console.log("Checking In User");
    console.log($rootScope.idValue);
    console.log($rootScope.latValue);
    console.log($rootScope.lonValue);
    console.log($rootScope.firstName);
    console.log($rootScope.lastName);
    console.log($rootScope.ip);

    //Use the nomadId, latitude, and longitude create a checkin for the user
    var data3 = JSON.stringify({ 
        'nomad_id': $rootScope.idValue, 
        'lat': $rootScope.latValue, 
        'lon': $rootScope.lonValue 
    });
    var url5 = "http://api-80-145420987.us-west-1.elb.amazonaws.com/checkins";
    var xhr5 = createCORSRequest('POST', url5);
        if (!xhr5) {
            throw new Error('CORS not supported');
        }
    xhr5.setRequestHeader('Preference-Applied', 'return=representation');
    xhr5.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr5.send(data3);
};