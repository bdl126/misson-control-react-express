const mongoose = require('mongoose')

const launchesSchema = mongoose.Schema({
    flightNumber:{
        type:Number,
        require: true
    },
    launchDate: {
        type: Date,
        require: true
    },
    mission: {
        type: String,
        require: true
    },
    customers: [String],
    rocket: {
        type: String,
        require: true
    },
    target: {
        type: String,
        require: true
    },

    upcoming: {
        type: Boolean,
        require: true
    },
    success: {
        type: Boolean,
        require: true,
        default: true
    },
});

// connect laucnehsSchema with the "launches" collection
module.exports = mongoose.model('launch', launchesSchema)