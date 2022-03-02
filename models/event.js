var mongoose = require("mongoose");

// link tags
// fix activityCategory
var eventSchema = mongoose.Schema({
    title:{type: String, required: true},
    eventID:{type: Number},
    venue:{type: String, required: true},
    date:{type: Date, required: true},
    numberOfParticipants:{type: Number},
    quota:{type: Number, required: true},
    activityCategory:{type: String, required: true},
    chatHistory:{type: String},
    createdAt:{type: Date, default: Date.now},
    createdBy:{type: Number}
});

eventSchema.pre("save",function(done){
    return done();
});


var Event = mongoose.model("Event", eventSchema);



module.exports = Event;