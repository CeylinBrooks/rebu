'use strict';

module.exports = (req, res, next) => {
    res.statusCode = 404;
    res.statusMessage = "Page Not Found";
    res.send("Page Not Found");
    res.end();
}