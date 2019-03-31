const mongoose = require('mongoose')

const queSchema = mongoose.Schema({
    lang: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    sol:[ {
        type: String,
        required: true
    }],
    opt:[{
        type: String,
        required: true
    }],
    type:{
        type: Number,
        required:true,
        default:0
    }
});

module.exports = mongoose.model('Que', queSchema);