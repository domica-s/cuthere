const User = require("../models/user");

// get user profile details
exports.getUserProfile = (req, res) => {
    User.findOne({sid:req.params.sid}).exec(function(err, user){
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (!user) {
            return res.status(404).send({ message: "User not found "});
        }

        return res.status(200).send({
            message: "Successfully retrieved user data",
            sid: user.sid,
            username: user.username,
            email: user.email,
            mobileNumber: user.mobileNumber,
            profilePicture: user.profilePicture,
            interests: user.interests,
            college: user.college,
            about: user.about,
            rating: user.rating,
            following: user.following,
            followers: user.followers,
            role: user.role,
            reviewHistory: user.reviewHistory,
            birthday: user.birthday,
            country: user.country,
            name: user.name,
        });
    });
}

// leave comment on user profile
// how to use?
// POST to url --> http://localhost:8080/user/:sid/comment
// params sid is target sid
// body (JSON) --> { "sid": sid, "content": content, "type": type }
// returns --> success, fail1 (user have previously left a comment, update instead)
//, fail2 (source/target sid not found, no similar events or other errors)
exports.leaveUserRating = (req, res) => {
    let sourceSID = req.body.sid;
    let targetSID = req.params.sid;
    let type = req.body.type; // good or bad rating (true for good)
    let content = req.body.content;

    User.findOne({ sid: targetSID })
    .exec((err, targetUser) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (!targetUser) {
            return res.status(404).send({ message: "Target user not found "});
        }

        User.findOne({ sid: sourceSID })
        .exec((err, sourceUser) => {
            if (err) {
                return res.status(500).send({ message: err});
            }

            if (!sourceUser) {
                return res.status(404).send({ message: "Source user not found "});
            }

            // if their events are not empty
            if (sourceUser.registeredEvents && targetUser.registeredEvents) {
                // if they share similar events
                if (sourceUser.registeredEvents.some(i => targetUser.registeredEvents.includes(i))) {
                    // if they left a comment before
                    // cannot comment anymore
                    let targetHistory = targetUser.reviewHistory;
                    let hasLeftComment = targetHistory.some(targetHistory => targetHistory.user === sourceSID)
                    if (hasLeftComment) {
                        return res.status(404).send({ message: "You have previously left a comment, update your comment instead."});
                    }

                    //  not yet left comment before
                    // can comment
                    let commentObj = {"user": sourceSID, "type": type, "content": content}
                    targetHistory.push(commentObj);
                    targetUser.reviewHistory = targetHistory;

                    targetUser.save((err) => {
                        if (err) {
                            return res.status(500).send({message: err});
                        }
                        
                        // console.log(targetUser.registeredEvents);
                        return res.status(200).send({ sourceSID: sourceSID,message: 'Your comment has been added successfully'});
                    })
                }
                else {
                    return res.status(404).send({ message: "You do not share any similar events with the target user"});
                }
            }
            else {
                return res.status(404).send({ message: "You do not share any similar events with the target user"});
            }
        })
    })
}


// update previous comment on user profile
// how to use?
// POST to url --> http://localhost:8080/user/:sid/comment/update
// params sid is target sid
// body (JSON) --> { "sid": sid, "newType": newType, newContent": newContent}
// returns --> success, fail1 (user have not previously left a comment, comment instead)
//, fail2 (source/target sid not found, no similar events or other errors)
exports.updateUserRating = (req, res) => {
    let sourceSID = req.body.sid;
    let targetSID = req.params.sid;
    let newType = req.body.newType; // good or bad rating
    let newContent = req.body.newContent;
    
    User.findOne({ sid: targetSID })
    .exec((err, targetUser) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (!targetUser) {
            return res.status(404).send({ message: "Target user not found "});
        }

        User.findOne({ sid: sourceSID })
        .exec((err, sourceUser) => {
            if (err) {
                return res.status(500).send({ message: err});
            }

            if (!sourceUser) {
                return res.status(404).send({ message: "Source user not found "});
            }

            // if their events are not empty
            if (sourceUser.registeredEvents && targetUser.registeredEvents) {

                // if they share similar events
                if (sourceUser.registeredEvents.some(i => targetUser.registeredEvents.includes(i))) {
                    
                    let targetHistory = targetUser.reviewHistory;
                    let hasLeftComment = targetHistory.some(targetHistory => targetHistory.user === sourceSID)
                    // if they left a comment before
                    // change old comment to new one
                    if (hasLeftComment) {
                        let commentObj = {"user": sourceSID, "type": newType, "content": newContent}
                        // get old comments, find and replace object with user sourceSID
                        let indexOfOldComment = targetHistory.findIndex(x => x.user === sourceSID);
                        // console.log(indexOfOldComment);
                        let newTargetHistory = targetHistory;
                        newTargetHistory[indexOfOldComment] = commentObj;
                        targetUser.reviewHistory = newTargetHistory;

                        targetUser.save((err) => {
                            if (err) {
                                return res.status(500).send({message: err});
                            }
                            
                            // console.log(targetUser.registeredEvents);
                            return res.status(200).send({ sourceSID: sourceSID, message: 'Your comment has been updated successfully'});
                        })
                    }
                    //  not yet left comment before
                    // cannot update, must comment instead
                    else {
                        return res.status(404).send({ message: "You have not previously left a comment, comment instead."});
                    }
                }
                else {
                    return res.status(404).send({ message: "You do not share any similar events with the target user"});
                }
            }
            else {
                return res.status(404).send({ message: "Source/ target user has not registered for an event."});
            }
        })
    })
}