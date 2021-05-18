'use strict';

var map;


function initMap() {
  var mapOptions = {
    center: { lat: 47.6062, lng: -122.3321 },
    zoom: 8,
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(function (position) {
    directionsInfo.innerHTML = `You are here ${position.coords.latitude}, ${postion.coords.longitude}`;
    var pos = new google.maps.LatLng(postion.cords.latitude, postion.cords.longitude);
    initMap(pos);
  })
}

var btn = $('#get-directions');

btn.on('click', function calcRoute() {
  
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };


  var directionsService = new google.maps.DirectionsService();
  
  directionsService.route(request, function (result, status) {
    console.log(result);
    console.log(result.routes[0].overview_path);
    if (status === 'OK') {

      initMap();
      const polyCoords = result.routes[0].overview_path;
        const polyBound = new google.maps.Polyline({
            path: polyCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
        });
      polyBound.setMap(map);

      
      const cost = ((parseInt(result.routes[0].legs[0].distance.value)/ 1609) * 1.75).toFixed(2);
      console.log(cost);
      
      const output = document.querySelector('#output');
      output.innerHTML = "<div class='alert-info'>Pick-up: " + start + "<br />Drop-off: " + end + "<br /> Driving distance: <i class='fas fa-road'></i> " + result.routes[0].legs[0].distance.text + "<br />Estimated Duration: <i class='fas fa-hourglass-start'></i> " + result.routes[0].legs[0].duration.text + "<br />Estimated Cost: $" + cost + "</div>";
  
    } else {
        output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
    }
  });
})

var options = {
  types: ['(cities)']
}

var autocomplete1;
var autocomplete2;
setTimeout(function initAutocomplete() {
  autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('start'),
    {
      types: ['establishment'],
      componentRestrictions: { 'country': ['us'] },
      fields: ['place_id', 'geometry', 'name']
    });
  autocomplete1.addListener('place_changed', onPlaceChanged);

  autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('end'),
    {
      types: ['establishment'],
      componentRestrictions: { 'country': ['us'] },
      fields: ['place_id', 'geometry', 'name']
    });

  autocomplete2.addListener('place_changed', onPlaceChanged);
}, 1000)

function onPlaceChanged() {
  var start = autocomplete1.getPlace(); 

  if (!start.name) {
    document.getElementById('start').placeholder = 'Enter A Pick-up'
  }
  
  var end = autocomplete2.getPlace();
  if (!end.name) {
    document.getElementById('start').placeholder = 'Enter A Drop-off'
  }
}
