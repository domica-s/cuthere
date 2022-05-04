// The code is the routes for functionalities related to the feed
// PROGRAMMER: Bryan
// Revised on 5/5/2022

var express = require("express");
var mongoose = require("mongoose");

var Event = require("../models/event");
var User = require("../models/user");

var router = express.Router();

const res = require("express/lib/response");

const { authJwt } = require("../middlewares");
const { update } = require("../models/event");
const { DATABASECONNECTION } = require("../params/params");

router.get("/feed/:sid", [authJwt.verifyToken], function(req,res){
                      /*
      This function is used to get the feed of a certain user
      Requirements (params): Include the user's sid as sid in the params
    */
    var currentUser = req.params.sid;
    User.findOne({ sid: currentUser }).exec(function (err, baseUser) {
      if (err) {
        res.status(400).send({ message: "error occured: " + err });
      } else if (baseUser === null) {
        res.status(404).send({ message: "User not found" });
      }
      else{
        let data = baseUser.feedActivities;
        var eidCol = [];
        var jsonData = {};
        for (var i in data){
          eidCol.push(data[i].eid);
        }
        Event.find({ eid: { $in : eidCol}}).sort({_id:-1}).exec(function(err, event){
          if(err){
            res.status(400).send({ message: "error occured: " + err });
          }
          if(event.length>0){
            for (var j=0; j < event.length; j++){
              //can only display one events at once
              var index = data.findIndex((element)=> element.eid == event[j].eventID);
              jsonData[j] = data[index];
            }
            res.send(jsonData);
          }
        })
      }
    })
})

module.exports = router;