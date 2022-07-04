const mongoose = require('mongoose')

const planetsSchema = mongoose.Schema({
    keplerName:{
        type:String,
        require: true
    },
});

module.exports = mongoose.model('planet', planetsSchema)