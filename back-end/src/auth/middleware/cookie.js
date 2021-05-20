'use strict';

const users = require('../models/users-schema.js');

module.exports = async (req, res, next) => {

  try {

    if (!req.cookies.token) { _authError() }

    const token = req.cookies.token;
    const validUser = await users.authenticateWithToken(token);

    req.user = validUser;
    // req.token = validUser.token;
    next();

  } catch (e) {
    _authError;
  }

  function _authError() {
    next('Invalid Login!!!!!!');
  }
}