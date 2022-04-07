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
    activityCategory:{type: String, required: true, enum: ['Basketball', 'Badminton', 'Soccer', 'Football','Hiking', 'Volleyball', 'Boardgame', 'Tennis', 'Running', 'Gaming', 'Swimming', 'Drinking', 'Study', 'Movies', 'FratParty', 'Athletics', 'Arts', 'Cooking']},
    chatHistory:[{
        user: {type: Number}, // SID
        content: {type: String}, // The Message
        chatAt: {type: Date}, // DateTime at which the message is created
        userDetails: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} // currentUser which has .sid, ._id, etc... (Sending the mongoose schema as a whole)
    }],
    createdAt:{type: Date, default: Date.now},
    createdBy:{type: mongoose.Schema.Types.ObjectId, required: false, unique: false, ref: 'User'},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});


var Event = mongoose.model("Event", eventSchema);

module.exports = Event;