'use strict';

angular.module('myApp').service('mapService', ['$window', function($rootScope, $window){
   var service = {
       
       setupMap : function(user, users, latValue, lonValue){
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
            var myMarker = L.marker([latValue, lonValue], {icon: myIcon}).addTo(mymap);
            //marker.bindPopup(user.firstName + " " + user.lastName).openPopup();
            
            //If we have other users, put them on the map
            console.log("Checking for other users...");
            if (typeof users !== 'undefined'){
                for(var i=0; i<users.length; i++){
                    var nomadMarker = L.marker([users[i].latValue, users[i].lonValue], {icon: myIcon}).addTo(mymap);
                    console.log("Added user:" + users[i].firstName);
                } 
                window.clearInterval();
            }
           return $rootScope;
        }
       
   }
   
   return service;
}]);