const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    place:{
        type: String,
        required: true,
    },
    memories:{
        type: String,
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