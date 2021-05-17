'use strict'

const express = require('express');
const authRouter = express.Router();

const User = require('./models/users-schema.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');

authRouter.post('/signup', async (req, res, next) => {
  try{
    let user = new User(req.body);
    const userInfo = await user.save()
    const output = {
      user: userInfo,
      token: userInfo.token
    };
    res.status(201).json(output)
  }catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user)
})

// not finished router for admin
authRouter.get('/events', bearerAuth, permissions('delete'), async (req, res, next) => {
  res.status(200).send('Welcome to the Admin router')
  
})

module.exports = authRouter;
