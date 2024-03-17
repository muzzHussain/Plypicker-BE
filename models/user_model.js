const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = new mongoose.Schema({
    email: {type: String},
    password: {type: String},
    role: {type: String}
}, {timestamps: true})


module.exports = mongoose.model('User', User);