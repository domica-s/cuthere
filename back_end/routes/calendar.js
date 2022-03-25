const router = require("express").Router();
const Event = require("../models/event")
const moment = require("moment")
const { authJwt } = require("../middlewares");

router.post("/create-event", async(req,res)=> {
    const event = Event(req.body);

    // EventID --> 
    const eID = Event.find().sort({ eventID: -1}).limit(1).then(function(err, eventID) {
        if (err) res.send("Error Occured: "+ err)
        else { 
            if (eventID.length>0) {
                event.eventID = eventID[0].eventID + 1 
            }
        }
    })
    
    // Set Event venue, activityCategory, quota
    event.venue = req.body.extendedProps.venue

    event.activityCategory = req.body.extendedProps.activityCategory

    event.quota = req.body.extendedProps.quota

    // Status Initialize to 'Open'
    event.status = 'Open'; 
    
    // numberOfParticipants ==> +1 when someone joins. Init to 1
    event.numberOfParticipants = 1; 

    // chatHistory Initialized to Empty String 
    event.chatHistory = '';

    // createdAt ==> See event.js 
    var itemCreatedBy = () => {
        if (req.user._id == undefined) ;
        else {
            event.createdBy = req.user._id;
        }
    }
    
    console.log(req.body)
    console.log(event)

    await event.save()
    
})

router.get("/get-event", async(req,res)=> {
    const events = await Event.find({
        start: {$gte: moment(req.query.start).toDate()}, 
        end: {$lte: moment(req.query.end).toDate()},
    });
    
    res.send(events);
});

// To route to a specific event page
router.get("/get-event/:eventID", async(req,res)=> {

    // Route to specific event page

});

// Reference for Filtering
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

module.exports = router;