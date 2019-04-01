const mongoose = require('mongoose')

const flawSchema = mongoose.Schema({
    qCode: {
        type: String,
        required: true,
        unique:true
    },
    qName: {
        type: String,
        required: true
    },
    desc:{
        type:String,
        required:true
    },
    ipFormat:{
        type:String
    },
    opFormat:{
        type:String
    },
    testcase:{
        type:String
    },
    constraint:{
        type:String
    },
    explain:{
        type:String
    },
    author: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    ipFile:{
        name:{
            type:String,
            default:""
        },
        value:{
            type:String,
            default:""
        }
    },
    opFile:{
        name:{
            type:String,
            default:""
        },
        value:{
            type:String,
            default:""
        }
    },
    timeLimit:{
        type:Number,
        default:1000
    },
    sourceLimit:{
        type:Number,
        default:5000000
    }
});

module.exports = mongoose.model('Flaw', flawSchema);