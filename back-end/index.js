'use strict';

require('dotenv').config();

const server = require('./src/server.js');
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;


const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}

mongoose.connect(MONGODB_URI, options)
    .then(() => {
        server.start(PORT);
    })
    .catch(e => console.error(e.message))

