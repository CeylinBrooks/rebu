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
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  map = new google.maps.Map(document.getElementById('map'), {disableDefaultUI: true});
  directionsRenderer.setMap(map);
  renderDirections(directionsService, directionsRenderer);
}

function renderDirections(directionsService, directionsRenderer) {
  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  directionsService.route(request, function (result, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);

      const cost = ((parseInt(result.routes[0].legs[0].distance.value) / 1609) * 1.75).toFixed(2);

      const output = document.querySelector('#output');

      output.innerHTML =
        `<div class='alert-info'> 
          <h4 id='pick-up'><b>Pick-up:</b> ${start}</h4>
          <h4 id='drop-off'><b>Drop-off:</b> ${end} </h4>
          <h4 id='drive-distance'><b>Driving distance:</b> ${result.routes[0].legs[0].distance.text} </h4>
          <h4 id='duration'><b>Estimated Duration:</b> ${result.routes[0].legs[0].duration.text}</h4>
          <h4 id='ess-cost'><b>Estimated Cost:</b> $${cost} </h4>
          </div>`;

    } else {
      output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
    }
  });
}

setTimeout(() => {
  initMap();
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