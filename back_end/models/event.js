const mongoose = require("mongoose");


const eventSchema = mongoose.Schema({

    title:{type: String},
    location:{type: String},
    quota:{type: Number},
    category:{type: String},
    start:{type: Date},
    end:{type: Date}

  

});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;