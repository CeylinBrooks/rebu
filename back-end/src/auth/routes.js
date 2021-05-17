'use strict'

const express = require('express');
const authRouter = express.Router();

const basicAuth = require('./middleware/basic.js');

const User = require('./models/users-schema.js');

authRouter.post('/signup', async (req, res, next) => {

  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };

    res.status(201).json({
      status: "success",
      output
    });
  } catch (e) {
    res.json({
      status: "error",
      error: e.message
    })
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  try {
    const user = {
      user: req.user,
      token: req.user.token
    };

    // Sets cookie "token" as user token
    res.cookie('token', req.user.token, {
      secure: true,
      httpOnly: true
    });

    res.cookie('id', req.user._id);

    res.json({
      status: "success",
      user
    });

  } catch (e) {
    res.json({
      status: "error",
      error: e.message
    })
  }
});

module.exports = authRouter;