const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: String,
    type: String,
    chapter: String,
    city: String,
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
    comments: {type: Array, default: []},
    rating: {type: Number, default: 0}
});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;