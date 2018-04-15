const mongoose = require('mongoose')

const answerSchema = mongoose.Schema({
    chal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chal',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    status: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Answer', answerSchema);