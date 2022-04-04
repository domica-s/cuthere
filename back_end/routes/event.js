var express = require("express");
var mongoose = require("mongoose");

var Event = require("../models/event");
var User = require("../models/user");

var router = express.Router();

const res = require("express/lib/response");

const { authJwt } = require("../middlewares");
const { update } = require("../models/event");
const { DATABASECONNECTION } = require("../params/params");

// List all events
router.get("/allevents", [authJwt.verifyToken], function (req, res) {

    var event_dic = {}

    Event.find(function (err, event) {
        
        if (event.length > 0){
            for (var i = 0; i < event.length; i++) {
                event_dic[i] = event[i]
            }
            res.send(event_dic) // you can put HTML here
        }
    })
})


// List one event details
router.get("/event/:id", [authJwt.verifyToken], function (req, res) {

    var event_id = req.params.id;
    Event.findOne({ eventID: event_id }).populate('chatHistory.userDetails').populate('participants').populate('createdBy')
    .exec(function(err, result){
        if (err) {
          res.status(400).send({ message: "error occured: " + err })
        }
        res.status(200).send(result);
    })
});



router.get("/featured/interest", [authJwt.verifyToken], function(req,res){
    var event_dic = {}
    let int = req.body.interests

    Event.find({
       int: activityCategory
    }).exec(function (err, event) {
      if (event.length > 0) {
        for (var i = 0; i < event.length; i++) {
          event_dic[i] = event[i];
        }
        var int_events = {
          title: "Events you might be interested in",
          event_dic,
        };
        res.send(int_events);
      }
    });
})

router.get("/featured/discover", [authJwt.verifyToken], function (req, res) {
  var event_dic = {};
  let int = req.body.interests;
  Event.find({
    int: { $not: { activityCategory } }
  }).exec(function (err, event) {
    if (event.length > 0) {
      for (var i = 0; i < event.length; i++) {
        event_dic[i] = event[i];
      }
      var int_events = {
        title: "Explore other interests!",
        event_dic,
      };
      res.send(int_events);
    }
  });
});

router.get("/featured/new", [authJwt.verifyToken], function (req, res) {
  var event_dic = {};

  Event.find({}).sort({
      eventID: -1
  }).exec(function (err, event) {
    if (event.length > 0) {
      for (var i = 0; i < 20; i++) {
        event_dic[i] = event[i];
      }
      var int_events = {
        title: "Newest Events",
        type: "/new",
        event_dic,
      };
      res.send(int_events);
    }
  });
});

router.get("/featured/upcoming", [authJwt.verifyToken], function (req, res) {
  var event_dic = {};

  Event.find({}).sort({
    start: 1
  }).exec(function (err, event) {
  if (event.length > 0) {
    for (var i = 0; i < 20; i++) {
      if(typeof event[i] !== 'undefined'){
        if(typeof event[i].start !== 'undefined'){
          if (event[i].start.getTime() > new Date().getTime()) {
            event_dic[i] = event[i];
          }
        }
      }
    }
    var int_events = {
      title: "Upcoming Events",
      type: "/upcoming",
      event_dic,
    };
    res.send(int_events);
  }
  });
});

router.post("/myevents", [authJwt.verifyToken], function(req, res){ 
    var event_dic = {};
    Event.find({ createdBy:req.body._sid }).exec(function(err, event){
        if(err){
            res.status(500).send({ message: err });
        }
        if (event.length > 0) {
          for (var i = 0; i < event.length; i++) {
            event_dic[i] = event[i];
          }
          res.status(200).send(event_dic);
        }
        else {
            res.status(400).send({ message: "Seems like you have not created any events yet!" });
        }
    })
});


// To create the event
router.post("/event", [authJwt.verifyToken], function (req, res, next) {
    var title =  req.body.title
    var location = req.body.location
    var start = req.body.start
    var end = req.body.end
    var quota = req.body.quota
    var category = req.body.category
    var theID = Event.find().sort({ eventID: -1 }).limit(1)
    
    if (start === end){
      res.status(400).send({message: "error: start date and end date is equal"});
    }
    theID.exec(function (err, eventID) {
        if (err) res.send("Error occured: " + err)
        else {
            var eID = 1
            if (eventID.length > 0){
                eID = eventID[0].eventID + 1
            }
        }
        var newEvent = new Event({
            title: title,
            eventID: eID,
            status: 'Open',
            venue: location,
            start: start,
            end: end,
            quota: quota,
            activityCategory: category,
            numberOfParticipants: 1,
            createdBy: req.body._id,
            participants: [req.body._id]
        });
    
        newEvent.save(next)
        res.status(200).send({message: "event created successfully"})
    });    
});

router.post("/event/chat/:id", [authJwt.verifyToken], function(req, res) {

    var event_id = req.params.id;
    var sid = req.body.sid;
    var _id = req.body._id;
    var timeNow = Date(Date.now());
    var content = req.body.content.toString();

    var update = {
      $push: { chatHistory: {
        user: sid,
        content: content,
        chatAt: timeNow,
        userDetails: _id
      } }
    }

    Event.findOneAndUpdate({ eventID: event_id }, update, (err, result) => {
      if (err) {
        res.status(400).send({ message: "error occured: " + err});
      }
      else {
        res.status(200).send({ message: "Comment added" });
      }
    });
});

router.post("/update", async function (req, res){
    // Get the Event to be updated
    event_to_be_updated = await Event.find({ eventID:req.body.id});

    // Check what to update
    if (req.body.title != null) event_to_be_updated.title = req.body.title
    if (req.body.location != null) event_to_be_updated.venue = req.body.location
    if (req.body.date != null) event_to_be_updated.date = req.body.date
    if (req.body.quota!= null) event_to_be_updated.quota = req.body.quota
    if (req.body.category != null) event_to_be_updated.activityCategory = req.body.category
    
    // update the event
    const updated_event = await Event.findOneAndUpdate({ eventID: req.body.id }, 
    {   
        title: event_to_be_updated.title,
        venue: event_to_be_updated.venue,
        date: event_to_be_updated.date,
        quota: event_to_be_updated.quota,
        activityCategory: event_to_be_updated.activityCategory
    });
    
    res.redirect("/event/"+req.body.id)
})

// register for an event




module.exports = router;