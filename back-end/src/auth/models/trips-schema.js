'use strict'

const mongoose = require('mongoose');

const tripsSchema = new mongoose.Schema({
  rider_id: {type: String, required: true},
  driver_id: {type: String, required: true},
  init_time: {type: String, required: true},
  accept_time: {type: String, required: true},
  pickup_time: {type: String, required: true},
  dropoff_time: {type: String, required: true},
  start_loc: {type: String, required: true},
  end_loc: {type: String, required: true}

})

module.exports = mongoose.model('trips', tripsSchema);