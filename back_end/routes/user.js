// The code is the routes to get the user's data
// PROGRAMMER: Domica
// Revised on 5/5/2022 

var express = require("express");

var User = require("../models/user");

const { authJwt } = require("../middlewares");

var router = express.Router();

router.get("/:sid", [authJwt.verifyToken], function(req,res){
        /*
      This function is used to get a user's data
      Requirements(params): Include the user's sid as sid in the params
    */
    User.findOne({sid:req.params.sid}).exec(function(err, users){
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send({
            sid: users.sid,
            username: users.username,
            email: users.email,
            mobileNumber: users.mobileNumber,
            profilePicture: users.profilePicture,
            interests: users.interests,
            college: users.college,
            about: users.about,
            rating: users.rating,
            friends: users.friends
        });
        return;
    });
});

module.exports = router;