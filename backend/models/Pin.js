const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    place:{
        type: String,
        required: true,
    },
    visited :{
        type: Boolean,
        default:false,
        required: true,
    },
    memories:{
        type: String,
    },
    dateOfVisit:{
        type: Date, 
    },
    long:{
        type: Number,
        required: true
    },
    lat:{
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Pin", PinSchema);