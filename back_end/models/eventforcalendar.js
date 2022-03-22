const mongoose = require("mongoose");

const eventforCalendarSchema = mongoose.Schema({

    title:{type: String},
    location:{type: String},
    quota:{type: Number},
    category:{type: String},
    start:{type: Date},
    end:{type: Date}

  

});

const EventCalendar = mongoose.model("EventCalendar", eventforCalendarSchema);

module.exports = EventCalendar;