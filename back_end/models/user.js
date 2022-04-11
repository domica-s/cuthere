var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var Event = require("./event");

const SALT_FACTOR = 10;

// fix profilepicture, friends setup, interests
var userSchema = mongoose.Schema({
    username:{type:String, required:true, unique:true},
    sid:{type:Number, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:false},
    mobileNumber:{type:Number, default:0},
    profilePicture:{type:mongoose.Schema.Types.ObjectId},
    interests:[{type:String}],
    college:{type:String},
    about:{type:String},
    following:[{type: mongoose.Schema.Types.ObjectId}],
    followers:[{type: mongoose.Schema.Types.ObjectId}],
    registeredEvents:[{
        event: {type: mongoose.Schema.Types.ObjectId},
        registeredAt: {type: Date}
    }],
    feedActivities:[{
        friend: {type: String},
        sid: {type: Number},
        event: {type: String},
        eid: {type: Number},
        timestamp: {type: Date},
        type: {type:String},
    }],
    starredEvents:[{type: mongoose.Schema.Types.ObjectId}],
    role:{type:String, enum: ['User', 'Admin']},
    active:{type:Boolean, default: false},
    posRating:{type:Number, default: 0},
    negRating:{type:Number, default: 0},
    reviewHistory:[{
        user: {type: Number, ref: 'User'},
        name: {type: String},
        type: {type: Boolean},
        content: {type: String},
        reviewAt: {type: Date, default:Date.now},
    }],
    createdAt:{type:Date, default:Date.now},
    name:{type:String},
    country:{type:String},
});

userSchema.pre('remove', function(res){
    var User = require("./user");
    var Event = require("./event");
    // Remove all the assignment docs that reference the removed event 
    // console.log(this);
    // remove user dependencies
    let update_review = {
        $pull: { reviewHistory: { user: this.sid } },
    }

    let update_followers = {
        $pull: { followers: this._id}
    }

    let update_following = {
        $pull: {following: this._id}
    }

    User.updateMany({}, update_review, (err, result) => {
        if (err) {
            console.log("mongoDB error: " + err);
        }
        else {
            // console.log("Successfully removed from registered event");
        }
    })

    User.updateMany({}, update_followers, (err, result) => {
        if (err) {
            console.log("mongoDB error: " + err);
        }
        else {
            // console.log("Successfully removed this from other user's follower list");
        }
    })

    User.updateMany({}, update_following, (err, result) => {
        if (err) {
            console.log("mongoDB error: " + err);
        }
        else {
            // console.log("Successfully removed this from other user's following list");
        }
    })


    // remove event dependencies
    let update_comments = {
        $pull: { chatHistory: { user: this.sid } },
    }

    let update_pinned = {
        $pull: { pinnedComment: { user: this.sid } },
    }

    let update_participants = {
        $pull: { participants: this.sid },
    }

    let update_no_of_participants = {
        $inc: { numberOfParticipants: -1 },
    }

    Event.updateMany({}, update_comments, (err, result) => {
        if (err) {
            console.log("mongoDB error: " + err);
        }
        else {
            // console.log("Successfully removed this user's comments from events");
        }
    })

    Event.updateMany({}, update_pinned, (err, result) => {
        if (err) {
            console.log("mongoDB error: " + err);
        }
        else {
            // console.log("Successfully removed this user's pinned comments from events");
        }
    })

    Event.updateMany({}, update_participants, (err, result) => {
        if (err) {
            console.log("mongoDB error: " + err);
        }
        else {
            // console.log("Successfully removed this user's pinned comments from participants lists");
        }
    })

    Event.updateMany({}, update_no_of_participants, (err, result) => {
        if (err) {
            console.log("mongoDB error: " + err);
        }
        else {
            // console.log("Successfully removed this user's pinned comments from participants count");
        }
    })

});

var User = mongoose.model("User", userSchema);

module.exports = User;