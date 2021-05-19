'use strict'

// // grab user loc
// function getLocation() {
//   navigator.geolocation.getCurrentPosition(function (position) {
//     directionsInfo.innerHTML = `You are here ${position.coords.latitude}, ${postion.coords.longitude}`;
//     var pos = new google.maps.LatLng(postion.cords.latitude, postion.cords.longitude);
//     initMap(pos);
//   })
// }

// Schedule pickup button
$('#schedule').on('submit', function calcRoute(e) {
  e.preventDefault();

  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;

  sessionStorage.setItem('start', start);
  sessionStorage.setItem('end', end);

  const rider = document.cookie;
  const rider_id = decodeURIComponent(rider).split('\"')[1];
  const init_time = new Date();
  const start_loc = start;
  const end_loc = end;

  const tripObj = {
    rider_id: rider_id,
    driver_id: 'NULL',
    init_time: init_time,
    accept_time: 'NULL',
    pickup_time: 'NULL',
    dropoff_time: 'NULL',
    start_loc: start_loc,
    end_loc: end_loc
  }

  console.log(tripObj);
  let socket = io();
  socket.emit('ride-scheduled', tripObj);
  socket.on('ride-scheduled', (trip) => {
    console.log('successful scheduling', trip);
  })
  
  // window.location.href = "/trip"

})

const options = {
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

// let logOut = () => {

//   fetch('logout', {
//     method: 'get',
//     credentials: 'include' // <--- YOU NEED THIS LINE

//   }).then(function(res) {
//     if (res.redirected) {
//       return window.location.replace(res.url);
//     }

//   }).catch(function(err) {
//     console.log(err);
//   });
// }