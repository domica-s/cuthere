// The code is the model for the emailToken
// PROGRAMMER: Domica
// Revised on 5/5/2022

const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    for: { type: String, required: true, enum: ['verifemail', 'resetpassword']},
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;