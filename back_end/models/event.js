var mongoose = require("mongoose");

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
        name: {type: String}, // Name
        content: {type: String}, // The Message
        chatAt: {type: Date}, // DateTime at which the message is created
        userDetails: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} // currentUser which has .sid, ._id, etc... (Sending the mongoose schema as a whole)
    }],
    pinnedComment: [{ // Validation is done in routes not in model.
        user: {type: Number},
        name: {type: String},
        content: {type: String},
        chatAt: {type: Date},
        userDetails: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    createdAt:{type: Date, default: Date.now},
    createdBy:{type: mongoose.Schema.Types.ObjectId, required: false, unique: false, ref: 'User'},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

// To fix, check this --> https://stackoverflow.com/questions/42521550/concurrency-issues-when-removing-dependent-documents-with-mongoose-middlewares 
eventSchema.pre('remove', function(res){
    var User = require("./user");
    // Remove all the assignment docs that reference the removed event 
    let update1 = {
        $pull: { registeredEvents: { event: this._id } },
    }
    let update2 = {
        $pull: {starredEvents: this._id}
    }

    User.updateMany({}, update1, (err, result) => {
        if (err) {
            console.log("mongoDB error: " + err);
        }
        else {
            console.log("Successfully removed from registered event");
        }
    })
    User.updateMany({}, update2, (err, result) => {
        if (err) {
            console.log("mongoDB error: " + err);
        }
        else {
            console.log("Successfully removed from starred event");
        }
    })    
});

var Event = mongoose.model("Event", eventSchema);


module.exports = Event;