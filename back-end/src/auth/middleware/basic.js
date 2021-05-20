'use strict';

const base64 = require('base-64');
const User = require('../models/users-schema.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');

  try {
    req.user = await User.authenticateBasic(user, pass);
    next();
  } catch (e) {
    console.log(e.message);
    _authError();
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }
}