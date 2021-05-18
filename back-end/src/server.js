'use strict';

// 3rd party libs
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const path = require('path');
const clientPath = path.join(__dirname + "../../../front-end/");

// Internal files
const notFound = require('./error-handlers/404.js');
const error = require('./error-handlers/500.js');
const authRoutes = require('./auth/routes.js');
const pageRoutes = require("./routes/routes.js");

// DB schema
const Trip = require('./auth/models/trips-schema.js'); // this should be moved out of Auth dir?
const Log = require('./auth/models/logger-schema');

// App Configuration
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(clientPath));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// Routers
app.use(authRoutes);
app.use(pageRoutes);

app.use("*", notFound);
app.use(error);

// In-memory requested rides queue
const rideQueue = {
    rides: {},
}

// Socket.io connection
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    // rider emits "ride-scheduled" and pass object with trip info(name, pickup, dropoff, timestamp)
    socket.on('ride-scheduled', async (trip) => {
        let tripId = trip._id;
        
        // add object to trip table
        try {
            const newTrip = new Trip(trip);
            await newTrip.save()
        } catch {
            res.status(500).json({ err: "error saving trip to db" });
        }
        
        // add event to logger db
        eventLogger(trip, 'requested');
        
        // add ride to queue
        rideQueue.rides.push(trip); // we will shift() this out on the front end button click

        socket.broadcast.emit('ride-scheduled', trip)
    })

    //driver accepts first ride in queue by clicking "Get New Trip"
    socket.on('ride-accepted', async (trip) => {
        
        // dequeue item from queue (on front end?)
        
        // TODO: driver_id = driver id (attached on front-end?)
        const driver_id = trip.driver_id;
        
        // log to logger
        eventLogger(trip, 'accecpted');
        
        // modify object in trip table
        const time = new Date();
        await db.trips.updateOne(
            { 'name': `${trip._id}` },
            { $set: { 'driver_id': `${driver_id}`, 'accecpt_time': `${time}` } },
            )
            // emit ride-accecpted event to rider
            socket.broadcast.emit('ride-accepted', { trip: trip, name: users[socket.id] })
    })

    // after driver accepts ride, new button appears to initiate pickup, on click emits pickup event
    socket.on('pickup', async (trip) => {


        // log to logger
        eventLogger(trip, 'pickup');

        // modify object in trip table
        const time = new Date();
        await db.trips.updateOne(
            { 'name': `${trip._id}` },
            { $set: { 'pickup_time': `${time}` } },
        )

        // rider listens and maybe add notification of pickup
        socket.broadcast.emit('pickup', { trip: trip, name: users[socket.id] })
    })

    // after driver inititiate pickup, new button appears for dropoff, on click, emits dropoff event
    socket.on('dropoff', async (trip) => {

        // log to logger
        eventLogger(trip, 'dropoff');

        // modify object in trip table
        const time = new Date();
        await db.trips.updateOne(
            { 'name': `${trip._id}` },
            { $set: { 'dropoff_time': `${time}` } },
        )

        // rider listens for event and displays final trip info
        socket.broadcast.emit('dropoff', { trip: trip, name: users[socket.id] })
    })

})

async function eventLogger(trip, event) {
    // logs trip event to logger db
    let time = new Date();
    let logItem = new Log({
        trip_id: trip._id, // ??? correct? 
        timestamp: time,
        event_type: event
    })
    await Log.save(logItem);
}

module.exports = {
    server: server,
    start: port => {
        server.listen(port, () => console.log(`Server up: ${port}`));
    }
}
