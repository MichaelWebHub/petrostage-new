const mongoose = require('mongoose');
const db_config = require('../config/database');

function db() {
    return new Promise(function(resolve, reject) {

        mongoose.connect(db_config.uri);

        mongoose.connection.once('open', function() {
            resolve("Connection has been made.");
        });

        mongoose.connection.on('error', function(error) {
            reject("Connection error: " + error.message);
        })
    })
}

module.exports = db;