const router = require("express").Router();
const Event = require("../models/event")
const moment = require("moment")
const { authJwt } = require("../middlewares");

router.post("/create-event",[authJwt.verifyToken], (req,res)=> {

    const event = Event(req.body);

    var theID = Event.find().sort({ eventID: -1 }).limit(1)
    
    // Prevent start and end at same date
    if (req.body.start === req.body.end){
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
        event.venue = req.body.extendedProps.venue
        event.eventID = eID
        event.status = 'Open'
        event.activityCategory = req.body.extendedProps.activityCategory
        event.quota = req.body.extendedProps.quota
        event.numberOfParticipants = 1
        event.chatHistory = new Object()
        event.createdBy = req.body.extendedProps.createdBy
        event.participants = [req.body.extendedProps.createdBy]
        
        console.log(event)
        event.save()
        res.status(200).send({message: "event created successfully"})
    }); 
    
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
router.post("/my-event", async(req, res) => { 

    const events = await Event.find({
        createdBy: req.body.createdBy, 
        start: {$gte: moment(req.query.start).toDate()},
        end: {$lte: moment(req.query.end).toDate()}
    })
    

    res.send(events);

    
});

// To route to an events detail page
router.get("/route-event/:id", async(req,res)=> {

    Event.findOne({eventID: req.params.id}, (err, result)=> {
        if (err) {
            res.status(400).send({ message: "error occured: "+ err})
        }
        else {

            res.status(200).send(result)
        }   
    })

});


module.exports = router;