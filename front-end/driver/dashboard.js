'use strict';

// get driver ID from client cookie
const driver = document.cookie;
const socket = io();
let currentTrip;


// accept ride
$('#accept').on('submit', function (e) {
  e.preventDefault();

  // tell server you accept a new ride
  socket.emit('ride-accepted', driver);
  // upon confirmation from server, save trip info to local storage
  socket.on('ride-accepted', (trip) => {
    sessionStorage.setItem('trip_id', trip._id)
    sessionStorage.setItem('trip', JSON.stringify(trip))
    window.location.href = "/trip"
  })

  // if no rides available, notify
  socket.on('no-trips', () => {
    // TODO: there is a bug that increases alerts with every click
    window.alert('No rides currently requested!');
  })
})

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