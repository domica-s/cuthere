const router = require("express").Router();
const Event = require("../models/event")
const moment = require("moment")
const { authJwt } = require("../middlewares");
const User = require("../models/user");

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
        console.log(req.body.extendedProps.activityCategory)
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

// Filter Function - All Events
router.get("/get-event",[authJwt.verifyToken], async(req,res)=> {
    const events = await Event.find({
        start: {$gte: moment(req.query.start).toDate()}, 
        end: {$lte: moment(req.query.end).toDate()},
    });
    
    res.send(events);
});

// Filter Function - My events 
router.post("/my-event", [authJwt.verifyToken], async(req, res) => { 

    user = req.body.user 

    const events = await Event.find({ 
        participants: user._id,
        start: {$gte: moment(req.query.start).toDate()},
        end: {$lte: moment(req.query.end).toDate()}
    })
    
    res.send(events)
});

// Filter Function - Favorite Events
router.post("/fav-event", [authJwt.verifyToken], (req, res) => { 

    user = req.body.user 
    

    // Get the User from db 
    User.findOne({_id: user._id}).exec(async function(err, userResult){
        let fav = userResult.starredEvents
        const stringFav = fav.map(x => x.toString()) // String
        console.log(stringFav)

        const events = await Event.find({
            _id: {$in: stringFav},
            start: {$gte: moment(req.query.start).toDate()}, 
            end: {$lte: moment(req.query.end).toDate()},
        })

        res.send(events)


    })
    

    
    // await User.find({_id: user._id}).exec(function (err,result){
    //     // Send the events where start and end date is as the format follows:
    //     let fav = result.starredEvents // Array of objects
    //     console.log(result)
    //     // let events = []
    //     // for (i =0; i<fav.length ; i++){
    //     //     // Check if start and End date match the condition 
    //     //     if (fav[i].start == {$gte: moment(req.query.start).toDate()} && fav[i].end == {$lte: moment(req.query.end).toDate()}) {
    //     //         // append event to the list
    //     //         events.append(fav[i])
    //     //     }
    //     // }
    //     // res.send(events)
    // })
    
});


// To route to an events detail page
router.get("/route-event/:id", [authJwt.verifyToken], async(req,res)=> {

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