'use strict';

const start = sessionStorage.getItem('start');
const end = sessionStorage.getItem('end');
const tripId = sessionStorage.getItem('trip_id');
let currentTrip;
const driver = document.cookie;
const socket = io();

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

      const output = document.querySelector('#driver-output');
      output.innerHTML = 
      `<div class='alert-info'> 
        <h4 id='pick-up'>Pick-up: ${start}</h4>
        <h4 id='drop-off'>Drop-off: ${end} </h4>
        <h4 id='ess-cost'>Estimated Cost: $${cost} </h4>
      </div>`;

    } else {
      output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
    }
  });
}, 1000);

// pickup ride
$('#pickup').on('submit', function (e) {
  e.preventDefault();
  // get trip info from local storage
  const currentTripStr = sessionStorage.getItem('trip');
  currentTrip = JSON.parse(currentTripStr);

  // emit pickup event to server
  socket.emit('pickup', currentTrip);
  // upon confirmation, log current trip status
  socket.on('pickup', (trip) => {
    console.log('picked up passenger', trip);
    currentTrip = trip;
  })
})

// dropoff ride
$('#dropoff').on('submit', function (e) {
  e.preventDefault();

  socket.emit('dropoff', currentTrip);
  socket.on('dropoff', (trip) => {
    console.log('dropped off passenger', trip);
    window.alert('success!')
    window.location.href = '/dashboard';
  })
})