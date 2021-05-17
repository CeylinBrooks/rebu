const express = require('express');
const pages = express.Router();

const path = require('path');
const clientPath = path.join(__dirname + "../../../../front-end");

const cookieParser = require('../auth/middleware/cookie.js');

pages.get('/', (req, res) => {
    res.sendFile("index.html", { root: clientPath });
})


pages.get('/signin', (req, res) => {
    res.sendFile("/auth/signin.html", { root: clientPath });
})

pages.get('/dashboard', cookieParser, (req, res) => {
    // res.sendFile("dashboard.html", { root: clientPath });
    res.send('this will be the dashboard');
})

pages.get('/about', (req, res) => {
    res.sendFile("about.html", {root: clientPath});
})

pages.get('/trip', (req, res) => {
    res.send('trips page');
})

pages.post('/dashboard', (req, res) => {
    res.send('post to dashboard');
})

pages.put('/dashboard', (req, res) => {
    res.send('this is the put on dashboard');
})

module.exports = pages;
