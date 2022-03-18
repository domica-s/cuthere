var express = require("express");

var ensureAuthenticated = require("../auth/auth").ensureAuthenticated;

var Event = require("../models/event");

var router = express.Router();

const res = require("express/lib/response");

router.use(ensureAuthenticated);

// List all events
router.get("/allevents", ensureAuthenticated, function (req, res) {

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

router.get("/", function(req, res){
    Event.find({createdBy:req.user._id}).exec(function(err, events){
        if(err){
            console.log(err);
        }
        res.render("event/all", {events:events})
    })
});

// To get the event
//router.get("/event/:eventId", function(req,res){
router.get("/", function (req, res) {
    /*Event.findOne({ eventID: req.params["eventId"]}).then((event_to_be_displayed) => {
        // console.log(event_to_be_displayed)
        var object = {
            title: event_to_be_displayed.title,
            location: event_to_be_displayed.venue,
            date: event_to_be_displayed.date,
            quota: event_to_be_displayed.quota,
            category: event_to_be_displayed.activityCategory,

        }
        res.send(event_to_be_displayed)
    })*/
    Event.find({ createdBy: req.user._id }).exec(function (err, events) {
    if (err) {
      console.log(err);
    }
    console.log("success");
    res.render("event/all", { events: events });
  });
});

// To create the event
router.post("/event", ensureAuthenticated, function (req, res, next) {
    var title =  req.body.title
    var location = req.body.location
    var date = req.body.date
    var quota = req.body.quota
    var category = req.body.category
    var theID = Event.find().sort({ eventID: -1 }).limit(1)
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
            date: date,
            quota: quota,
            activityCategory: category,
            numberOfParticipants: "",
            chatHistory: "",
            createdBy: req.user._id
        });
    
        newEvent.save(next)
        res.redirect('/event')        
    });    
});

// Delete Event
router.post('/event/delete', ensureAuthenticated, function(req,res){
    let id = req.body.id
    console.log(id)
    Event.findOneAndDelete({eventID: id}).exec(function(err,event){
        if (err) res.send("The error is: " + err); 
        else if (event == null) res.send("No Matching Event!"); 
        else { 
            res.redirect("/event")
        }

    })
})

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