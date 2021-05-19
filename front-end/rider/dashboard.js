'use strict'

let map;

// Initialize map 
function initMap() {
  const mapOptions = {
    center: { lat: 47.6062, lng: -122.3321 },
    zoom: 8,
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

// grab user loc
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
  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };


  // TODO: get rider ID (how?)
  // const rider_id = $('');
  const init_time = new Date();
  const start_loc = start;
  console.log(start_loc);
  const end_loc = end;

  const tripObj = {
    rider_id: 'TEST',
    driver_id: 'NULL',
    init_time: init_time,
    accept_time: 'NULL',
    pickup_time: 'NULL',
    dropoff_time: 'NULL',
    start_loc: start_loc,
    end_loc: end_loc
  }


  let socket = io();
  socket.emit('ride-scheduled', tripObj);
  socket.on('ride-scheduled', (trip) => {
    console.log('successful scheduling', trip);
    // window.location.href = "/trip"
    //  TODO: redirect to trip page
  })
})


const directionsService = new google.maps.DirectionsService();

directionsService.route(request, function (result, status) {
  console.log(result);
  console.log(result.routes[0].overview_path);
  if (status === 'OK') {

    // initMap(); this needs to move elsewhere
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
    console.log(cost);

    const output = document.querySelector('#output');
    output.innerHTML = "<div class='alert-info'>Pick-up: " + start + "<br />Drop-off: " + end + "<br /> Driving distance: <i class='fas fa-road'></i> " + result.routes[0].legs[0].distance.text + "<br />Estimated Duration: <i class='fas fa-hourglass-start'></i> " + result.routes[0].legs[0].duration.text + "<br />Estimated Cost: $" + cost + "</div>";

  } else {
    output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
  }
});


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