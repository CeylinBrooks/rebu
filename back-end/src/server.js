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
const Trips = require('./auth/models/trips-schema.js'); // this should be moved out of Auth dir?
const Logs = require('./auth/models/logger-schema.js');
const Users = require('./auth/models/users-schema.js');

// App Configuration
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(clientPath));
app.use(cors());
app.use(cookieParser());

// Routers
app.use(authRoutes);
app.use(pageRoutes);

app.use("*", notFound);
app.use(error);

// In-memory requested rides queue
const rideQueue = [];

// Socket.io connection
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// const rebu = io.of('/rebu');

io.on('connection', socket => {
    console.log('Connected to server');
    // rider emits "ride-scheduled" and pass object with trip info(name, pickup, dropoff, timestamp)
    socket.on('join', room => {
        console.log('joined room', room);
        socket.join(room);
        
    });

    socket.on('ride-scheduled', async (tripObj) => {
        console.log('ride requested');

        try {
            // add object to trip table
            const newTrip = new Trips(tripObj);
            const tripRecord = await newTrip.save()

            // add event to logger db
            eventLogger(tripRecord, 'requested');

            // add ride to queue
            rideQueue.push(tripRecord); // we will shift() this out on the front end button click

            // emit 'ride-scheduled' event back to rider
            socket.emit('ride-scheduled', tripRecord);


        } catch {
            console.error();
            // res.status(500).json({ err: "error saving trip to db" });
        }

    })

    // driver accepts first ride in queue by clicking "Get New Trips"
    socket.on('ride-accepted', async (driver) => {
        // dequeue item from queue
        const trip = rideQueue.shift();
        console.log({ trip });

        if (trip === undefined) {
            console.log('NO TRIPS TO GET');
            socket.emit('no-trips');
            return 0;
            // TODO: Post MVP, add message to send to Driver
        }
        console.log('trip', trip);

        // Retreive driver _id from db
        const driverDecoded = decodeURIComponent(driver).split('\"')[1];
        const driverObj = await Users.findById(driverDecoded);
        console.log('driverObj', driverObj);

        // log to logger
        eventLogger(trip, 'accepted');

        // modify object in trip table
        const time = new Date();
        try {
            const res = await Trips.updateOne(
                { '_id': `${trip._id}` },
                { $set: { 'driver_id': `${driverObj._id}`, 'accept_time': time } },
            );
            console.log('mongo response', res);
            const updatedTrip = await Trips.findById(trip._id);
            // emit ride-accepted event to rider
            socket.to(`${trip._id}`).emit('ride-accepted', updatedTrip);
            socket.emit('ride-accepted', updatedTrip);
            // rebu.to(updatedTrip.rider_id).emit('ride-accepted', updatedTrip);

        } catch {
            console.error();
        }
    })

    // after driver accepts ride, new button appears to initiate pickup, on click emits pickup event
    socket.on('pickup', async (trip) => {

        // log to logger
        eventLogger(trip, 'pickup');

        // modify object in trip table
        const time = new Date();
        await Trips.updateOne(
            { '_id': `${trip._id}` },
            { $set: { 'pickup_time': time } },
        )

        const updatedTrip = await Trips.findById(trip._id);
        socket.to(`${trip._id}`).emit('pickup', updatedTrip);
        // rider listens and maybe add notification of pickup TODO:
        socket.emit('pickup', updatedTrip);
    })

    // after driver inititiate pickup, new button appears for dropoff, on click, emits dropoff event
    socket.on('dropoff', async (trip) => {

        // log to logger
        eventLogger(trip, 'dropoff');

        // modify object in trip table
        const time = new Date();
        await Trips.updateOne(
            { '_id': `${trip._id}` },
            { $set: { 'dropoff_time': time } },
        )

        const updatedTrip = await Trips.findById(trip._id);
        socket.to(`${trip._id}`).emit('dropoff', updatedTrip);
        // rider listens for event and displays final trip info
        socket.emit('dropoff', updatedTrip)
    })

    // get logs items from db, return on get-logs event
    socket.on('get-logs', async (id) => {
        const logs = await Logs.find();
        console.log(logs);
        socket.emit('get-logs', logs);
    })
})

async function eventLogger(trip, event) {
    // logs trip event to logger db
    const time = new Date();
    const logItem = new Logs({
        trip_id: trip._id,
        timestamp: time,
        event_type: event
    })
    const logRecord = await logItem.save();
    console.log('logRecord', logRecord);
}

module.exports = {
    server: server,
    start: port => {
        server.listen(port, () => console.log(`Server up: ${port}`));
    }
}
