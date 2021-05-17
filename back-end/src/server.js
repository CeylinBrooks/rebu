'use strict';

//3rd party libs
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


const path = require('path');
const clientPath = path.join(__dirname + "../../../front-end/");

//Internal files
const notFound = require('./error-handlers/404.js');
const error = require('./error-handlers/500.js');
// const userRoutes = require('./routes/users.js');
const authRoutes = require('./auth/routes.js');

const pageRoutes = require("./routes/routes.js");


//App Configuration
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(clientPath));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// app.use(userRoutes);
app.use(authRoutes);
// app.use(pageRoutes);

app.use("*", notFound);
app.use(error);


//Socet.io connection
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    // rider emits "ride-scheduled" and pass object with trip info(name, pickup, dropoff, timestamp)
    socket.on('ride-scheduled', ({ trip }) => {
        users[socket.id] = name
        socket.broadcast.emit('ride-scheduled', name)
        //add object to trip table
        //add event to logger db
        //add ride to queue
    })

    //driver accepts first ride in queue by clicking "Get New Trip"
    socket.on('ride-accepted', message => {
        socket.broadcast.emit('ride-accepted', { message: message, name: users[socket.id] })
        //dequeue item from queue
        //log to logger
        //modify object in trip table
    })

    //after driver accepts ride, new button appears to initiate pickup, on click emits pickup event
    socket.on('pickup', message => {
        socket.broadcast.emit('pickup', { message: message, name: users[socket.id] })
        //rider listens and maybe add notification of pickup
        //log to logger
        //modify object in trip table
    })

    // after driver inititiate pickup, new button appears for dropoff, on click, emits dropoff event
    socket.on('dropoff', message => {
        socket.broadcast.emit('dropoff', { message: message, name: users[socket.id] })
        // log to logger
        //modify object in trip table
        //rider listens for event and displays final trip info
    })

})

module.exports = {
    server: server,
    start: port => {
        server.listen(port, () => console.log(`Server up: ${port}`));
    }
}
