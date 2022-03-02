var mongoose = require("mongoose");

// link tags
// fix activityCategory
var eventSchema = mongoose.Schema({
    title:{type:String, required:true},
    tags:{type:Number, required:true, unique:true},
    venue:{type:String, required:true},
    date:{type:Date, required:true},
    numberOfParticipants:{type:Number, required:true},
    activityCategory:{type:String, required:true},
    chatHistory:{type:String, required:true},
    createdAt:{type:Date, default:Date.now}
});

eventSchema.pre("save",function(done){
    return done();
});


var Event = mongoose.model("Event", eventSchema);



module.exports = Event;