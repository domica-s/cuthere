var mongoose = require("mongoose");

var photoSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String
    }
});

var Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;