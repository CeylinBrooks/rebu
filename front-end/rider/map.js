'use strict';

var maps;
var directionsRenderer;
var directionsService;
var stepDisplay;
var google;
var directionsService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer();

function initMap() {
  var mapOptions = {
    center: { lat: 47.6062, lng: -122.3321 },
    zoom: 8,
  };
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsRenderer.setMap(map);
}

const directionsButton = document.querySelector('#get-directions');
directionsButton.addEventListener('click', calcRoute);
let autocomplete = new google.maps.places.Autocomplete(DOM_NODE);

autocomplete.bindTo('bounds', map);

autocomplete.addListener('place_changed', () => {
  const place = autocomplete.getPlace();
})

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
      console.log(result);
    }
  });
}