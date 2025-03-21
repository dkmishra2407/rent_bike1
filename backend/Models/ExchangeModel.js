const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
    ExchangeId: {
        type: String,
        required: true,
        unique: true
    },
    AllExchanges: [{
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
        Symbol: {
            type: String,
            required: true
        },
        Time: {
            type: Date,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('Exchange', ExchangeSchema);