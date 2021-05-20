'use strict';

const id = document.cookie;
const socket = io();

$(function () {
  // send admin-logs event to server
  socket.emit('admin-logs')
  // upon receipt, populate list with log objects 
  socket.on('admin-logs', (logs) => {
    logs.map(log => {
      console.log(log);
      // append each log item to logs list
      $("#log").append(`<li> ID: ${log._id} <br> Time: ${log.timestamp} <br> Event: ${log.event_type}</li>`);
    })
  })
})