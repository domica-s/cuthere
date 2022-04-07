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
        Event.find({ eventID: { $in : eidCol}}).exec(function(err, event){
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

/*
            Event.findById(eventId, function(err, resEvent){
                if(err){
                    res.status(400).send({ message: "error occured: " + err });
                }
                else if(resEvent == null){
                    //console.log("Event not found");
                    cont = true;
                }
                else{
                    //event_tmp = Object.assign({}, resEvent);
                    //event_tmp = JSON.parse(JSON.stringify(resEvent));
                    event_tmp = resEvent;
                    console.log("Event found: ", event_tmp);
                }
            })
            
            User.findById(userId, function(err, resUser){
                if(err){
                    res.status(400).send({ message: "error occured: " + err });
                }
                else if(resUser == null){
                    //console.log("User not found");
                    cont = true;
                }
                else{
                    //user_tmp = Object.assign({}, resUser);
                    user_tmp = resUser;
                    //console.log("User found: ", user_tmp);
                }
            })
            returnData[0] = event_tmp;
            returnData[1] = user_tmp;
            returnData[2] = timeId;*//*
        for (var i in data){
          let userId = data[i].friend;
          let eventId = data[i].eid;
          console.log(eventId);
          let timeId = data[i].timestamp;

          //comment out the 3 line below to try
          returnData[0] = userId;
          returnData[1] = eventId;
          returnData[2] = timeId;
          console.log(returnData);
          if (!cont) {
            jsonData[counter] = returnData;
            counter += 1;
          }*/