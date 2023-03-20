/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

var directionsRenderer;
var directionsService;
var intervalID ;
 function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("The Browser Does not Support Geolocation");
    }
}

function getLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("The Browser Does not Support Geolocation");
    }
}

function success(position) {
    var pose;
    pose = ("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    document.getElementById("lat").innerHTML=position.coords.latitude;
    document.getElementById("long").innerHTML=position.coords.longitude;
    //console.log(pose);
}
function error(error) {
    if(error.PERMISSION_DENIED){
        console.log("The User have denied the request for Geolocation.");
    }
}
function showPosition(position) {
    var pose;
    pose = ("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    initMap(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
    document.getElementById("lat").innerHTML=position.coords.latitude;
    document.getElementById("long").innerHTML=position.coords.longitude;
    console.log(pose);
}
function showError(error) {
    if(error.PERMISSION_DENIED){
        console.log("The User have denied the request for Geolocation.");
    }
}

function updateMap() {
  var end1 = document.getElementById('end1');
  var end2 = document.getElementById('end2');
  var selectedEnd = end1.checked ? end1.value : end2.value;
  calculateAndDisplayRoute(selectedEnd);
}



function initMap(lat,lng) {
   directionsRenderer = new google.maps.DirectionsRenderer();
   directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 25,
    center: { lat:  lat, lng:  lng},
    disableDefaultUI: false
  });

  var marker = new google.maps.Marker({
    position: { lat:  lat, lng:  lng},
    map: map,
  });
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById("sidebar"));

  //const control = document.getElementById("floating-panel");

  //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  document.getElementById("end").addEventListener("change", onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  document.getElementById("startWa").style.display = "block";
  const start = document.getElementById("lat").innerHTML+','+document.getElementById("long").innerHTML
  console.log(start);
  const end = document.getElementById("end").value;

  directionsService
    .route({
      origin: {
        query: start,
      },
      destination: {
        query: end,
      },
      travelMode: google.maps.TravelMode.WALKING,
    })
    .then((response) => {
    	console.log(response);
    	
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + e));
}
















function calculateAndDisplayRouteLive(directionsService, directionsRenderer) {
  getLiveLocation();
  const start = document.getElementById("lat").innerHTML+','+document.getElementById("long").innerHTML
  console.log(start);
  const end = document.getElementById("end").value;

  directionsService
    .route({
      origin: {
        query: start,
      },
      destination: {
        query: end,
      },
      travelMode: google.maps.TravelMode.WALKING,
    })
    .then((response) => {
    	console.log(response.routes[0].legs[0].distance.value);

      var distance = response.routes[0].legs[0].distance.value;
      //console.log(distance);
     
      console.log(distance);
      showAR(distance);
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + e));
}


getLocation()

function startWalkings()
{
  document.getElementById("startWa").style.display = "none";
  document.getElementById("stopWa").style.display = "block";

  intervalID  = setInterval(function(){calculateAndDisplayRouteLive(directionsService, directionsRenderer)}, 1000);
  console.log("Walkings");
}

function stopWalkings()
{
  clearInterval(intervalID);
  document.getElementById("startWa").style.display = "block";
  document.getElementById("stopWa").style.display = "none";
  console.log("Stop Walkings");
}

function showAR(distanceFromPointB)
{
  if(distanceFromPointB<10)
  {
    document.getElementById("seeAR").style.display = "block";
  }
  else
  {
    console.log("Come closer of your destination to pass to AR Mode");
    if(document.getElementById("seeAR").style.display == "block"){
      document.getElementById("seeAR").style.display = "none";
    }
  }
  
}

function openAR(){
  window.open("https://parisius.github.io", '_blank');
}

function displayRoute() {

    var start = new google.maps.LatLng(28.694004, 77.110291);
    var end = new google.maps.LatLng(28.72082, 77.107241);

    var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
    directionsDisplay.setMap(map); // map should be already initialized.

    var request = {
        origin : start,
        destination : end,
        travelMode : google.maps.TravelMode.DRIVING
    };
    var directionsService = new google.maps.DirectionsService(); 
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}