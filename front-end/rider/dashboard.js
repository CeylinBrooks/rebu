'use strict'
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


// Schedule ride
$('#schedule').on('submit', function (e) {
  e.preventDefault();

  // TODO: Dan fills in below from google-maps api

  // const rider_id = ;
  const init_time = new Date();
  // const start_loc = ;
  // const end_loc = ;

  const tripObj = {
    rider_id: 'TEST',
    driver_id: 'NULL',
    init_time: init_time,
    accept_time: 'NULL',
    pickup_time: 'NULL',
    dropoff_time: 'NULL',
    start_loc: 'TEST',
    end_loc: 'TEST'
  }


  let socket = io();
  socket.emit('ride-scheduled', tripObj);
  socket.on('ride-scheduled', (trip) => {
    console.log('successful scheduling', trip);
    window.location.href = "/trip"
    //  TODO: redirect to trip page
  })
})