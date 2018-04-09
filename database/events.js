const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: String,
    type: String,
    chapter: String,
    city: String,
    timestamp: Date,
    dateFrom: String,
    dateTo: String,
    place: String,
    description: String,
    email: String,
    website: String,
    facebook: String,
    vk: String,
    instagram: String,
    tags: {type: Array, default: []},
    comments: {
        usersCommented: Array,
        comments: [{
            date: String,
            author: String,
            comment: String
        }]
    },
    rating: {
        usersRated: Array,
        n: Number,
        sum: Number
    },
    creators: Array
});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;