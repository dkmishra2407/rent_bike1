const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Qty: {
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Time: {
        type: Date,
        required: true
    },
    ExchangeId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Exchange', ExchangeSchema);