'use strict'

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  // name: {type: String, required: true},
  // email: {type: String, required: true},
  role: {type: String, required: true, enum: ['rider', 'driver', 'admin']}
}, {toJSON: { virtuals: true }});

userSchema.virtual('token').get(function () {
  let tokenObj = {
    username: this.username
  }
  return jwt.sign(tokenObj, process.env.SECRET)
});

userSchema.virtual('capabilities').get(function () {
  //
  //Discuss ACL for all users
  //
  let acl = {
    rider: ['read', 'create', 'update'],
    driver: ['read', 'create', 'update'],
    admin: ['read', 'create', 'update', 'delete']
  }
  return acl[this.role]
});

userSchema.pre('save', async function () {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 5)
  }
})

// Basic AUTH

userSchema.statics.authenticateBasic = async function(username, password) {
  const user = await this.findOne({ username });
  const valid = await bcrypt.compare(password, user.password);
  if(valid) { return user; }
  throw new Error('Invalid User')
}

// AUTH with TOKEN
userSchema.statics.authenticateWithToken = async function(token) {
  try{
    const parsedToken = jwt.verify(token, process.env.SECRET)
    const user = this.findOne({ username: parsedToken.username });
    if(user) { return user; }
    throw new Error('User Not Found');
  }catch (e) {
    throw new Error(e.message)
  }
}

module.exports = mongoose.model('users', userSchema)