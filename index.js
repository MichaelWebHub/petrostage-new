const EventEmitter = require('events');
const helmet = require('helmet');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const nodemailer = require('nodemailer');
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

const emitter = new EventEmitter();
emitter.setMaxListeners(30);

// Middleware

app.use(express.static('public'));
app.use(helmet());
app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Get

app.get('/*', function(req, res) {
    res.redirect(req.baseUrl + '/');
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

    socket.on('signUp', function (data) {
        console.log(data);
        db()
            .then(() => {

                User.find({email: data.email}).then((res) => {

                    if (data.email === res[0].email) {
                        socket.emit('retrieveUserData', {
                            user: {},
                            status: false,
                            message: 'User with this email already exists'
                        })
                    }
                })
                    .catch(() => {
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
            })
    });

    socket.on('getEvents', function () {

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

    socket.on('addEvent', function (data) {

        db()
            .then(() => {

                const event = new Event(data);
                event.rating.rating = 0;
                event.rating.n = 0;
                event.rating.sum = 0;
                event.timestamp = new Date(data.dateFrom);

                event.save().then(function (newEvent) {
                    console.log("A new event has been added to the database.");
                    io.emit('retrieveNewEvent', {
                        event: newEvent,
                        status: true,
                        message: 'Event has been registered'
                    })
                }).catch(function (err) {
                    console.log(err.message);
                });
            })

    });

    socket.on('editEvent', function (data) {

        db()
            .then(() => {

                if (data.dateFrom) {
                    data.timestamp = new Date(data.dateFrom);
                }

                Event.findOneAndUpdate({_id: ObjectId(data._id)}, data, {new: true}).then(function (newEvent) {
                    io.emit('retrieveEvent', {
                        event: newEvent,
                        status: true,
                        message: 'Event has been updated'
                    })
                }).catch(function (err) {
                    console.log(err.message);
                });
            })

    });

    socket.on('deleteEvent', function (id) {

        db()
            .then(() => {
                Event.remove({_id: ObjectId(id)}).then(() => {
                    console.log('Item deleted');
                });
            })
    });

    socket.on('sendNewComment', function (data) {

        const comment = {
            date: data.date,
            author: data.author,
            comment: data.comment
        };

        db()
            .then(() => {

                Event.findOneAndUpdate({_id: ObjectId(data.id)}, {$push: {'comments.comments': comment, 'comments.usersCommented': data.userId}}, {
                    safe: true,
                    upsert: true,
                    new: true
                }).then(function (newEvent) {
                    io.emit('retrieveEvent', {
                        event: newEvent,
                        status: true,
                        message: 'New comments has been added'
                    })
                }).catch(function (err) {
                    console.log(err.message);
                });
            })

    });

    socket.on('rateEvent', function (data) {

        db()
            .then(() => {

                Event.findOneAndUpdate({_id: ObjectId(data.eventId)}, {$push: {'rating.usersRated': data.userId}, $inc: {'rating.n': 1, 'rating.sum': data.rating}}, {
                    safe: true,
                    upsert: true,
                    new: true
                }).then(function (newEvent) {
                    io.emit('retrieveEvent', {
                        event: newEvent,
                        status: true,
                        message: 'New comments has been added'
                    })
                }).catch(function (err) {
                    console.log(err.message);
                });
            })

    });


    // send Email

    socket.on('sendEmail', function(data) {

        const transporter = nodemailer.createTransport({
            service: "Yandex",
            auth: {
                user: "michael.kutateladze@yandex.ru",
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: "michael.kutateladze@yandex.ru",
            to: "michael.kutateladze@yandex.ru",
            subject: 'PetroStage contact form',
            text: data.from.name + '\n\n' + data.from.email + '\n\n' + data.message
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                socket.emit('sendEmailCb', {
                    status: true,
                    text: "There was an error sending an email. If occurs again, please send email to michael.kutateladze@yandex.ru"
                });
            } else {
                console.log('Email sent: ' + info.response);
                socket.emit('sendEmailCb', {
                    status: true,
                    text: "Message has been sent. Have a nice day!"
                });
            }
        });

    });

});