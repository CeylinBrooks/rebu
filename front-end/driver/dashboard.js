'use strict';

// get driver ID from client cookie
const driver = document.cookie;
const socket = io();



// accept ride
$('#accept').on('submit', function (e) {
  e.preventDefault();

  // tell server you accept a new ride
  socket.emit('ride-accepted', driver);
  // upon confirmation from server, save trip info to local storage
  socket.on('ride-accepted', (trip) => {
    sessionStorage.setItem('trip_id', trip._id);
    sessionStorage.setItem('start', trip.start_loc);
    sessionStorage.setItem('end', trip.end_loc);
    sessionStorage.setItem('trip', JSON.stringify(trip));
    window.location.href = "/trip"
  })

  // if no rides available, notify
  socket.on('no-trips', () => {
    // TODO: there is a bug that increases alerts with every click
    window.alert('No rides currently requested!');
  })
})



// get history
$(function () {
  // send driver-history event to server
  socket.emit('driver-history', driver)
  // upon receipt, populate list with log objects 
  socket.on('driver-history', (trips) => {
    console.log(trips);
    trips.map(trip => {
      console.log(trip);
      // append each log item to logs list
      $("#driver-history").append(`<li> <b>Time:</b> ${trip.init_time} <br> <b>To:</b> ${trip.end_loc}</li>`);
    })
  })
})