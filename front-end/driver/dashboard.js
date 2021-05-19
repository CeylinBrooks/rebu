'use strict';

const driver = document.cookie;
const socket = io();
let currentTrip;

// accept ride
$('#accept').on('submit', function (e) {
  e.preventDefault();

  socket.emit('ride-accepted', driver);
  socket.on('ride-accepted', (trip) => {
    console.log('accepted trip', trip);
    currentTrip = trip;
    // TODO: redirect to trip page
  })
})

// pickup ride
$('#pickup').on('submit', function (e) {
  e.preventDefault();

  socket.emit('pickup', currentTrip);
  socket.on('pickup', (trip) => {
    console.log('picked up passenger', trip);
    currentTrip = trip;
    // TODO: redirect to trip page
  })
})

// dropoff ride
$('#dropoff').on('submit', function (e) {
  e.preventDefault();

  socket.emit('dropoff', currentTrip);
  socket.on('dropoff', (trip) => {
    console.log('dropped off passenger', trip);
    // TODO: redirect to trip page
  })
})