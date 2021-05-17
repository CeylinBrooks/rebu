'use strict'

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  email: {type: String, required: true},
  role: {type: String, required: true, enum: ['rider', 'driver', 'admin']}
}, {toJSON: { virtuals: true }});

userSchema.virtual('token').get(function () {
  let tokenObj = {
    username: this.username
  }
})