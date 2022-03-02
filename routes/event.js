var express = require("express");
var Event = require("../models/event");
const res = require("express/lib/response");
var router = express.Router();

var ensureAuthenticated = require("../auth/auth").ensureAuthenticated;

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
            venue: location,
            date: date,
            quota: quota,
            activityCategory: category,
            numberOfParticipants: "",
            chatHistory: "",
            createdBy: req.user.sid
        });
    
        newEvent.save(next)
        res.redirect('/')        
    });    
});

router.delete('/event/:id', ensureAuthenticated, (req, res) => {
    let id = req.params.id
    Event.findOneAndDelete({ eventID: id }, (err, event) => {
        if (err){
            res.send("Error occured: " + err)
        } 
        else if (event == null) {
            res.send("There is no matching event!")
        }
        else {
            res.send("Event deleted")
        }
    })
})

module.exports = router;