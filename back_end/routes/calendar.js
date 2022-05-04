// The code is the routes for implementation for calendar-related functionalities
// PROGRAMMER: Philip
// Revised on 5/5/2022

const router = require("express").Router();
const Event = require("../models/event")
const moment = require("moment")
const { authJwt } = require("../middlewares");
const User = require("../models/user");

router.post("/create-event",[authJwt.verifyToken], (req,res)=> {
              /*
      This function is used to create a specific event
      Requirements (Body): pass 1) Start date as start, 2) End date as end, 3) event id as eID, 4) venue as .extendedProps.venue, 5) category as extendedProps.activityCategory, 6) quota as extendedProps.quota, 7) Creator id as extendedProps.createdBy in the body
    */

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
        event.createdBy = req.body.extendedProps.createdBy
        event.participants = [req.body.extendedProps.createdBy]
    
        event.save()

        // Add this event to the one who created it 
        User.findOneAndUpdate({_id: event.createdBy}, {$push:{
            registeredEvents: {
                event: event, 
                registeredAt: Date(Date.now())
            }
        }}, function(err, result){
            if (err) res.status(400).send({message: "Error Occured: "+ err})
            else {
                // Get the list of followers for the creator
                const followers = result.followers

                // Loop through the followers: 
                for (var f in followers){
                    const curFollowers = followers[f].toString();
                    // Update Feed Activities for those curated followers
                    User.findOneAndUpdate({_id: curFollowers}, {$push:{
                        feedActivities: {
                            friend: result.username,
                            sid: result.sid, 
                            event: event.title,
                            eid: eventID, 
                            timestamp: Date(Date.now()),
                            type: "Create"
                        }
                    }}, function(err, res){
                        if (err) res.status(400).send({message:"Error Occured: "+ err})
                        else console.log("Updated your followers!")
                    })
                }
            }
        })
        res.status(200).send({message: "Event Created Successfully!"})

    }); 
    
})


router.get("/get-event",[authJwt.verifyToken], async(req,res)=> {
              /*
      This function is called to filter all events in the calendar
      Requirements (Query): pass 1) Event start date as start, and 2) Event ending date as end in the query
    */
    const events = await Event.find({
        start: {$gte: moment(req.query.start).toDate()}, 
        end: {$lte: moment(req.query.end).toDate()},
    });
    
    res.send(events);
});


router.post("/my-event", [authJwt.verifyToken], async(req, res) => { 
                  /*
      This function is called to filter a specific user's event in the calendar
      Requirements (Query): pass 1) Event start date as start, and 2) Event ending date as end in the query
      Requirements (Body): pass the user object as user in the body
    */

    user = req.body.user 

    const events = await Event.find({ 
        participants: user._id,
        start: {$gte: moment(req.query.start).toDate()},
        end: {$lte: moment(req.query.end).toDate()}
    })
    
    res.send(events)
});

router.post("/fav-event", [authJwt.verifyToken], (req, res) => { 
                      /*
      This function is called to filter the favorite events of a specific user in the calendar
      Requirements (Query): pass 1) Event start date as start, and 2) Event ending date as end in the query
      Requirements (Body): pass the user object as user in the body
    */

    user = req.body.user
    // Get the User from db 
    User.findOne({_id: user._id}).exec(async function(err, userResult){
        let fav = userResult.starredEvents
        const stringFav = fav.map(x => x.toString()) // String
        const events = await Event.find({
            _id: {$in: stringFav},
            start: {$gte: moment(req.query.start).toDate()}, 
            end: {$lte: moment(req.query.end).toDate()},
        })

        res.send(events)


    })
    
});

router.get("/route-event/:id", [authJwt.verifyToken], async(req,res)=> {
                      /*
      This function is called to route a clicked event in the calendar to the specific event's page
      Requirements (Prams): pass the eventId as id in the params
    */
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