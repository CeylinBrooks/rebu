'use strict';

const id = document.cookie;
const socket = io();

$(function () {
  // send get-logs event to server
  socket.emit('get-logs', id)
  // upon receipt, populate list with log objects 
  socket.on('get-logs', (logs) => {
    logs.map(log => {
      console.log(log);
      // append each log item to logs list
      $("#log").append(`<li> ID: ${log._id} \n Time: ${log.timestamp} \n Event: ${log.event_type}</li>`);
    })
  })
})