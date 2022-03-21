var mongoose = require("mongoose");

// link tags
// fix activityCategory
var eventSchema = mongoose.Schema({
    // title:{type: String, required: true},
    // eventID:{type: Number},
    // status:{type:String, enum: ['Open', 'Closed']},
    // venue:{type: String, required: true},
    // date:{type: Date, required: true},
    // numberOfParticipants:{type: Number},
    // quota:{type: Number, required: true},
    // activityCategory:{type: String, required: true},
    // chatHistory:{type: String},
    // createdAt:{type: Date, default: Date.now},
    // createdBy:{type: mongoose.Schema.Types.ObjectId, required: false, unique: false},

    // To be edit later
    start: Date,
    end: Date,
    title: String

});

eventSchema.pre("save",function(done){
    return done();
});


var Event = mongoose.model("Event", eventSchema);



module.exports = Event;