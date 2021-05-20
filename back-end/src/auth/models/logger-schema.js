'use strict'

const mongoose = require('mongoose')

const loggerSchema = new mongoose.Schema({
  trip_id: {type: String, required: true},
  timestamp: {type: String, required: true},
  event_type: {type: String, required: true}
})

module.exports = mongoose.model('logger', loggerSchema)