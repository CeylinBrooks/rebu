'use strict'

const express = require('express');
const authRouter = express.Router();

const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');

authRouter.post('/signup', (req, res) => {
  const sqlString = 'INSERT INTO users (username, pass_hash, name, email, role) VALUES ($1, $2, $3, $4, $5) RETURNING id;'
  const sqlArray = [req.body.username, req.body.pass_hash, req.body.name, req.body.email, req.body.role];

  client.query(sqlString, sqlArray)
    .then()
})