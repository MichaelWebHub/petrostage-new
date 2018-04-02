const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const {ObjectId} = require("mongodb");
const db = require('./database/connection');
const mongoose = require('mongoose');
const User = require('./database/users');
const Event = require('./database/events');


const app = express();
const port = process.env.PORT || 3000;
const jsonParser = bodyParser.json();

const server = app.listen(port);
const io = socket(server);

// Middleware

app.use(express.static('public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Socket

io.on('connection', function (socket) {

    console.log("Server: Connection has been made");

    // Login
    socket.on('logIn', function (data) {
        db()
            .then(function () {

                User.find({email: data.email, password: data.password})
                    .then(function (result) {

                        if (result[0].password === data.password && result[0].email === data.email) {
                            socket.emit('retrieveUserData', {
                                user: result[0],
                                status: true,
                                message: 'You are now logging in'
                            });
                        } else {
                            socket.emit('retrieveUserData', {
                                user: {},
                                status: false,
                                message: 'Incorrect username or password'
                            });
                        }

                    })
                    .catch(() => {
                        socket.emit('retrieveUserData', {
                            user: {},
                            status: false,
                            message: 'Incorrect username or password'
                        });
                    })
            })
            .catch(function (error) {
                socket.emit('retrieveUserData', {
                    user: {},
                    status: false,
                    message: 'Could not connect to the database'
                });
            });
    });

    socket.on('signUp', function(data) {
        db()
            .then(() => {

                const user = new User({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    university: data.university
                });

                user.save().then(function (newUser) {
                    console.log("A new user has been added to the database.");
                    socket.emit('retrieveUserData', {
                        user: newUser,
                        status: true,
                        message: 'You have been registered'
                    })
                }).catch(function (err) {
                    console.log(err.message);
                });
            })
    });

    socket.on('getEvents', function() {

        db()
            .then(() => {

                Event.find({}).then(function (events) {

                    socket.emit('retrieveEvents', {
                        events: events,
                        status: true,
                        message: 'Events has been retrieved'
                    })
                }).catch(function (err) {
                    console.log(err.message);
                });
            })

    });

    socket.on('addEvent', function(data) {

        db()
            .then(() => {

                const event = new Event(data);

                event.save().then(function (newEvent) {
                    console.log("A new event has been added to the database.");
                    socket.emit('retrieveEvent', {
                        event: newEvent,
                        status: true,
                        message: 'Event has been registered'
                    })
                }).catch(function (err) {
                    console.log(err.message);
                });
            })

    });

});