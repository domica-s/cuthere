var express = require("express");
var mongoose = require("mongoose");

var Event = require("../models/event");
var User = require("../models/user");

var router = express.Router();

const res = require("express/lib/response");

const { authJwt } = require("../middlewares");
const { update } = require("../models/event");
const { DATABASECONNECTION } = require("../params/params");

/*
router.get("/feed", [authJwt.verifyToken], function(req,res){
    let currentUser = req.body.sid;
    User.findOne({ sid: currentUser }).exec(function (err, baseUser) {
      if (err) {
        res.status(400).send({ message: "error occured: " + err });
      } else if (baseUser === null) {
        res.status(404).send({ message: "User not found" });
      }
      //access all user that the user follow
      res.status(200).send({ message: "OK" });
      
    var followingList = baseUser.following;
    var feeds = {};
    for (let i = 0; i < followingList.length; i++){
      let userFollowed = followingList[i];
      let sidUser = userFollowed.sid;
      User.findOne({sid: sidUser}).exec((err, followUser) =>{
        if (err) {
          res.status(400).send({ message: "error occured: " + err });
        } else if (baseUser === null) {
          res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({message: "Ok"});
      })
    }
   
    console.log(baseUser);
    res.status(200).send({message: "No following"});
    });
})

module.exports = router;

router.get("/feed", [authJwt.verifyToken], function(req,res){
    let userId = req.body.id;
    User.find({_id: userId}, ())
})*/