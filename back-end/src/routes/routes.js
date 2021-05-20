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
        res.sendFile("/driver/driver-dashboard.html", { root: clientPath });
    } else if (req.user.role === 'rider') {
        res.sendFile("/rider/rider-dashboard.html", { root: clientPath });
    } else if (req.user.role === 'admin') {
        res.sendFile("/admin/admin-dashboard.html", { root: clientPath });
    }
})

pages.get('/about', (req, res) => {
    res.sendFile("about.html", { root: clientPath });
})

pages.get('/trip', cookieParser, (req, res) => {
    // if-else to serve driver-trip or rider-trip html
    if (req.user.role === 'driver') {
        res.sendFile("/driver/driver-trip.html", { root: clientPath });
    } else if (req.user.role === 'rider') {
        res.sendFile("/rider/rider-trip.html", { root: clientPath });
    }
})

pages.post('/dashboard', cookieParser, (req, res) => {
    // rider requests ride, emits 'ride-scheduled' event
    // redirects to rider trip page
    res.send('post to dashboard');
})

pages.put('/dashboard', cookieParser, (req, res) => {
    // driver completes trip. emits 'dropoff', redirects to driver dashboard
    res.send('this is the put on dashboard');
})

module.exports = pages;
