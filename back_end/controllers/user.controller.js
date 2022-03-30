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
            friends: user.friends,
            role: user.role
        });
    });
}

// leave comment on user profile
exports.leaveUserRating = (req, res) => {
    let sourceSID = req.body.sid;
    let targetSID = req.params.sid;
    let type = req.body.type; // like or dislike (true or false)
    let comment = req.body.comment;

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

            // if they share similar events

                // if they share a similar event but left a comment before
                // cannot comment anymore

                //  not yet left comment before
                // can comment

        })
    })
}