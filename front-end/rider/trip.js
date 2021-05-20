'use strict';

const start = sessionStorage.getItem('start');
const end = sessionStorage.getItem('end');
const tripId = sessionStorage.getItem('trip_id');

let socket = io();

socket.emit('join', tripId);

socket.on('ride-accepted', (trip) => {
  console.log('ride accepted', trip);
  if(trip) {
    const output= document.getElementById('messages');
    const time = Math.ceil(Math.random() * 10);
    output.innerHTML=`<p>Driver Accepted Your Trip and is ${time} minutes away</p>`;
  }
})

socket.on('pickup', (trip)=> {
  console.log('pickup', trip);
  if(trip) {
    const output= document.getElementById('messages');
    output.innerHTML=`<p>Your ride has arrived!</p>`;
  }
})

socket.on('dropoff', (trip)=> {
  console.log('dropoff', trip);
  if(trip) {
    const output= document.getElementById('messages');
    output.innerHTML=`<p>Your ride has ended, please exit the car</p>`;
    setTimeout(function(){
      window.location.href = '/dashboard';

    }, 3000)
  }
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
}, 1000);