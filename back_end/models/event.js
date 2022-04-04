var mongoose = require("mongoose");

// link tags
// fix activityCategory
var eventSchema = mongoose.Schema({
    title:{type: String, required: true},
    eventID:{type: Number},
    status:{type:String, enum: ['Open', 'Closed']},
    venue:{type: String, required: true},
    start:{type: Date, required: true},
    end:{type: Date, required: true},
    numberOfParticipants:{type: Number},
    quota:{type: Number, required: true},
    activityCategory:{type: String, required: true, enum: ['Basketball', 'Badminton', 'Soccer', 'Football','Hiking', 'Volleyball', 'Board Games', 'Tennis', 'Running', 'Gaming', 'Swimming', 'Drinking', 'Study', 'Movies', 'Frat Parties', 'Athletics', 'Arts', 'Cooking']},
    chatHistory:[{
        user: {type: Number},
        content: {type: String},
        chatAt: {type: Date},
        userDetails: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    createdAt:{type: Date, default: Date.now},
    createdBy:{type: mongoose.Schema.Types.ObjectId, required: false, unique: false, ref: 'User'},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});


var Event = mongoose.model("Event", eventSchema);

module.exports = Event;