const mongoose = require('mongoose')

const chalSchema = mongoose.Schema({
    title: {
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
    files: [String],
    points: {
        type: Number,
        required: true
    },
    flag: {
        type: String,
        required: true,
    },
    users: [String]
});

module.exports = mongoose.model('Chal', chalSchema);