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
// const pageRoutes = require("./routes/pages.js");

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

module.exports = {
    server: app,
    start: port => {
        app.listen(port, () => console.log(`Server up: ${port}`));
    }
}
