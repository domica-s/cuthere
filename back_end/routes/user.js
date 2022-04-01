var express = require("express");

var User = require("../models/user");

const { authJwt } = require("../middlewares");

var router = express.Router();

router.get("/:sid", [authJwt.verifyToken], function(req,res){
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

function checkFollowing(id, followers){
    let followed = false;
    for(let i=0; i<followers.length; i++){
        if(id === followers[i]._id.toString()){
            followed = True;
        }
    }
    return followed;
}

router.post('/user/follow/:id', [authJwt.verifyToken], function(req, res){
    var user_id = req.params.id; //who to follow
    var _id = req.body._id; //current user
    var followed = false; 
    User.findOne({ sid: user_id}, (err, result) => {
        if(err){
            res.status(400).send({message: "error occured: " + err})
        }
        else if(result === null){
            res.status(400).send({message: "User not found"});
        }
        else{
            followed = checkFollowing(_id, result.followers);
            if(followed){
                res.status(202).send({message: "You have followed this user"});
            }
            else{
                var updateFollower = {
                    $push: {followers: _id},
                }
                var updateFollowing = {
                    $push: {following: result},
                }
                User.updateOne({ sid: user_id}, updateFollower, (err, result)=>{
                    if (err){
                        res.status(400).send({message: "error occured: "+ err});
                    }
                    else{
                        res.status(200).send({message: "OK"});
                    }
                });
                User.updateOne({ _id: _id}, updateFollowing, (err, result)=>{
                    if (err){
                        res.status(400).send({message: "error occured: "+ err});
                    }
                    else{
                        res.status(200).send({message: "OK"});
                    }
                });
            }
        }
    });
})

module.exports = router;