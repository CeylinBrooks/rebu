'use strict';

// accept ride
$('#accept').on('submit', function (e) {
  e.preventDefault();


  const driver = document.cookie;

  let socket = io();
  socket.emit('ride-accepted', driver);
  socket.on('ride-accepted', (trip) => {
    console.log('accepted trip', trip);
    // TODO: redirect to trip page
  })
})