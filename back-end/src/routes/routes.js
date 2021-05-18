const express = require('express');
const pages = express.Router();

const path = require('path');
const clientPath = path.join(__dirname + "../../../../front-end");

const cookieParser = require('../auth/middleware/cookie.js');

pages.get('/', (req, res) => {
    res.sendFile("index.html", { root: clientPath });
})

pages.get('/signup', (req, res) => {
    res.sendFile("/auth/signup.html", { root: clientPath });
})

pages.get('/signin', (req, res) => {
    res.sendFile("/auth/signin.html", { root: clientPath });
})

pages.get('/dashboard', cookieParser, (req, res) => {
    // if-else to server driver-dash or rider-dash or admin-dash html
    // not sure if this is best method but it seems to work -brs 
    if (req.user.role === 'driver') {
        res.send('DRIVER Dash')
    } else if (req.user.role === 'rider') {
        res.send('RIDER Dash')
    }else if (req.user.role === 'admin') {
        res.send('ADMIN Dash')
    }
    // res.sendFile("dashboard.html", { root: clientPath });
    // res.status(200).send('this will be the dashboard');
})

pages.get('/about', (req, res) => {
    res.sendFile("about.html", {root: clientPath});
})

pages.get('/trip', (req, res) => {
    // if-else to serve driver-trip or rider-trip html
    res.send('trips page');
})

pages.post('/dashboard', (req, res) => {
    // rider requests ride, emits 'ride-scheduled' event
    // redirects to rider trip page
    res.send('post to dashboard');
})

pages.put('/dashboard', (req, res) => {
    // driver completes trip. emits 'dropoff', redirects to driver dashboard
    res.send('this is the put on dashboard');
})

module.exports = pages;
