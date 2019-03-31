const mongoose = require('mongoose');
const Que=require('./que');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    access: {
        type: Number,
        required: true
    },
    lang:{
        type:String,
        default:"Z"
    },
    contests:{
        cryptoquest:{
            isEligible:{
                type:Boolean,
                default:false
            },
            status:{
                type:Boolean,
                default:false
            },
            score:{
                type:Number,
                default:0
            },
            startTime:{
                type:Date,
                default:null
            }
        },
        bughunt:{
            isEligible:{
                type:Boolean,
                default:false
            },
            status:{
                type:Boolean,
                default:false
            },
            score:{
                type:Number,
                default:0
            },
            startTime:{
                type:Date,
                default:null
            }
        },
        flawless:{
            isEligible:{
                type:Boolean,
                default:false
            },
            status:{
                type:Boolean,
                default:false
            },
            score:{
                type:Number,
                default:0
            },
            startTime:{
                type:Date,
                default:null
            }
        }
    },

    submission:[{
        queId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Que'
        },
        ans:[{
            type:String
        }],
        status:{
            type:Number,
            default:1
        }
    }]
});

module.exports = mongoose.model('User', userSchema);