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

// Filter Function - All Events
router.get("/get-event", async(req,res)=> {
    const events = await Event.find({
        start: {$gte: moment(req.query.start).toDate()}, 
        end: {$lte: moment(req.query.end).toDate()},
    });
    
    res.send(events);
});

// Filter Function - My events 
router.post("/my-event", [authJwt.verifyToken], async(req, res) => { 
    
    const events = await Event.find({
        createdBy: req.body._sid, 
        start: {$gte: moment(req.query.start).toDate()},
        end: {$lte: moment(req.query.end).toDate()}
    })

    res.send(events);

    
});

// To route to an events detail page
router.get("/get-event/:id", async(req,res)=> {

    console.log(req.params.id)
    Event.findOne({id: req.params.id}, (err, result)=> {
        if (err) {
            res.status(400).send({ message: "error occured: "+ err})
        }
        else {
            console.log(result)
            res.status(200).send(result)
        }
    })

});


module.exports = router;