var mongoose = require("mongoose");

// link tags
// fix activityCategory
var eventSchema = mongoose.Schema({
    title:{type:String, required:true},
    tags:{type:String},
    venue:{type:String, required:true},
    date:{type:Date, required:true},
    numberOfParticipants:{type:Number, required:true},
    activityCategory:{type:Number, required:true},
    chatHistory:{type:String, required:true},
    createdAt:{type:Date, default:Date.now}
});

var Event = mongoose.model("Event", eventSchema);

module.exports = Event;