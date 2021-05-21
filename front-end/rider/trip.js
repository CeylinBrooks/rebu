'use strict';

const start = sessionStorage.getItem('start');
const end = sessionStorage.getItem('end');
const tripId = sessionStorage.getItem('trip_id');

let socket = io();

socket.emit('join', tripId);

socket.on('ride-accepted', (trip) => {
  console.log('ride accepted', trip);
  if (trip) {
    const output = document.getElementById('messages');
    const time = Math.ceil(Math.random() * 10);
    output.innerHTML = `<p>Driver Accepted Your Trip and is ${time} minutes away</p>`;
  }
})

socket.on('pickup', (trip) => {
  console.log('pickup', trip);
  if (trip) {
    const output = document.getElementById('messages');
    output.innerHTML = `<p>Your ride has arrived!</p>`;
  }
})

socket.on('dropoff', (trip) => {
  console.log('dropoff', trip);
  if (trip) {
    const output = document.getElementById('messages');
    output.innerHTML = `<p>Your ride has ended, please exit the car</p>`;
    setTimeout(function () {
      window.location.href = '/dashboard';

    }, 3000)
  }
})

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