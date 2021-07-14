const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username: {
        type:String,
        required: true,
        min: 3,
        max: 20
    },
    password:{
        type: String,
        min: 6
    },
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema);