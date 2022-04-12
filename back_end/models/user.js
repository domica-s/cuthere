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

userSchema.pre('remove', function(res) {
    var User = require("./user");
    var Event = require("./event");
    var Token = require("./emailToken");
    // Remove all the assignment docs that reference the removed event 
    // console.log(this);
    // remove user dependencies

    let update_followers = {
        $pull: { followers: this._id}
    }

    let update_following = {
        $pull: { following: this._id}
    }
    
    // delete this user's rating content and impact on rating
    User.find({ reviewHistory: { $elemMatch: { user: this.sid } } })
    .exec((err, users) => {
        if (err) {
            console.log("mongoDB error in removing users review: " + err);
        }
        if (!users) {
            console.log("Users not found");
        }
        else {
            console.log("Printing users");
            console.log(users);
            console.log(this.sid);
            // loop through users array
            // for each user, get rating of comment
            let update_review_content = {
                $pull: { reviewHistory: { user: this.sid } },
            }
            let update_rating = {
                $inc: { posRating: -1 },
            }

            users.forEach(user => {
                console.log(user);
                var getCommentObj = (user.reviewHistory).find(x => x.user === this.sid)
                console.log(getCommentObj);
                if (getCommentObj.type === true) {
                    console.log("type is true");
                }
                else {
                    console.log("type is false");
                    update_rating = {
                        $inc: { negRating: -1 },
                    }
                }
                // update user
                User.findOneAndUpdate({ sid: user.sid }, update_rating)
                .exec((err, result) => {
                    if (err) {
                        console.log("mongoDB error in remove rating score: " + err);
                    }
                    else {
                        console.log("Successfully updated pos/neg rating");
                    }
                })
            })

            User.updateMany({}, update_review_content)
            .exec((err, result) => {
                if (err) {
                    console.log("mongoDB error in remove rating content: " + err);
                }
                else {
                    console.log("Successfully removed rating contents");
                }
            })
        }
    })

    User.updateMany({}, update_followers, (err, result) => {
        if (err) {
            console.log("mongoDB error in update follower: " + err);
        }
        else {
            console.log("Successfully removed this from other user's follower list");
        }
    })

    User.updateMany({}, update_following, (err, result) => {
        if (err) {
            console.log("mongoDB error in update following: " + err);
        }
        else {
            console.log("Successfully removed this from other user's following list");
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
        $pull: { participants: this._id },
    }

    let update_no_of_participants = {
        $inc: { numberOfParticipants: -1 },
    }

    Event.updateMany({}, update_comments, (err, result) => {
        if (err) {
            console.log("mongoDB error in update event comments: " + err);
        }
        else {
            console.log("Successfully removed this user's comments from events");
        }
    })

    Event.updateMany({}, update_pinned, (err, result) => {
        if (err) {
            console.log("mongoDB error in update pinned comments: " + err);
        }
        else {
            console.log("Successfully removed this user's pinned comments from events");
        }
    })
    
    Event.updateMany({ participants: this._id }, update_no_of_participants, (err, result) => {
        if (err) {
            console.log("mongoDB error in update no of participants: " + err);
        }
        else {
            console.log("Successfully updated dependent events' noofparticipants ");
        }
    })

    Event.updateMany({}, update_participants, (err, result) => {
        if (err) {
            console.log("mongoDB error in update participants list: " + err);
        }
        else {
            console.log("Successfully removed this user from participants lists");
        }
    })

    // delete all events created by this user
    Event.find({ createdBy: this._id })
    .exec((err, events) => {
        if (err) {
            console.log("mongoDB error in deleting events created by this user: " + err);
        }
        else {
            // console.log(events);
            // return res.status(200).send({message:"Nice"});
            events.forEach(event => {
                Event.findOneAndDelete({ eventID: event.eventID })
                .exec((err, result) => {
                    if (err) {
                        console.log("mongoDB error in deleting events created by this user: " + err);
                    }
                    if (!result) {
                        console.log("mongoDB error in deleting events from this user: event not found");
                    }
                    else {
                        const doc = new Event(result);
                        doc.remove();
                        console.log("removed user's dependent event");
                    }
                })
            })
        }
    })

    // delete all tokens related
    Token.deleteMany({ _userId: this._id })
    .exec((err, result) => {
        if (err) {
            console.log("mongoDB error in deleting tokens: " + err);
        }
        else {
            console.log("Successfully removed this user's tokens");
        }
    })

});


var User = mongoose.model("User", userSchema);

module.exports = User;