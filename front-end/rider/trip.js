'use strict';

const start = sessionStorage.getItem('start');
const end = sessionStorage.getItem('end');

let socket = io();

socket.on('ride-accepted', (trip) => {
  console.log('ride accepted', trip);
})

let map;

// Initialize map 
function initMap() {
  const mapOptions = {
    center: { lat: 47.6062, lng: -122.3321 },
    zoom: 8,
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

setTimeout(() => {

  // TODO: query db for trip obj, pass start and end to request below

  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };

  const directionsService = new google.maps.DirectionsService();

  directionsService.route(request, function (result, status) {
    // console.log(result);
    // console.log(result.routes[0].overview_path);
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


      const cost = ((parseInt(result.routes[0].legs[0].distance.value) / 1609) * 1.75).toFixed(2);
      // console.log(cost);

      const output = document.querySelector('#output');
      output.innerHTML = "<div class='alert-info'>Pick-up: " + start + "<br />Drop-off: " + end + "<br /> Driving distance: <i class='fas fa-road'></i> " + result.routes[0].legs[0].distance.text + "<br />Estimated Duration: <i class='fas fa-hourglass-start'></i> " + result.routes[0].legs[0].duration.text + "<br />Estimated Cost: $" + cost + "</div>";

    } else {
      output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
    }
  });
}, 1000);