var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var Event = require("../models/event");
const res = require("express/lib/response");
const e = require("connect-flash");
var router = express.Router();

// To create the event
router.post("/event", function (req, res, next) {
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

// To delete the event 
// router.delete("/delete/:eventId", (req, res) => {
// 	let id = req.params.eventId;
//     if (!ObjectID.isValid(id)) {
//         return res.status(400).send();
//     }
//     Event.findOneAndRemove({eventId: id}, (err,event) => {
//         if(err) res.send("The Error is:" + err); 
//         else {
//             res.send(
//                 "Event Deleted,<br>\n" +
//                     "The Event Id is :" +
//                     event.eventId +
//                     "<br>\n" +
//                     "Location Id is :" +
//                     loc.locId +
//                     "<br>\n" +
//                     "Location Name is  :" +
//                     loc.name +
//                     "<br>\n" +
//                     "Event name is :" +
//                     event.name +
//                     "<br>\n" +
//                     "Event quota is :" +
//                     event.quota +
//                     "<br>\n"
//             );
//         }
//     })		
// });

router.delete('/event/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(400).send();
    }

    Event.findByIdAndRemove(id).then((docs) => {
      res.status(200).send({docs})
    }).catch((e) => {
      res.status(400)
    });
  });




module.exports = router;