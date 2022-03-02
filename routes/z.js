var express = require('express')
var parser = require('body-parser')
var path = require('path')
const { nextTick } = require('process')
const { captureRejectionSymbol } = require('events')
var router = express.Router()

router.use(parser.urlencoded ({ extended: false}) )
router.use(parser.json) 

router.use(function(req,res){
    res.locals.userValue = null;
    nextTick();
})

// router.set('view engine', 'ejs') 
// router.set('views', path.join(__dirname,'app views'))

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

router.get("/event/:eventId", function(req, res){
    var event_id = req.params.eventId 
    var event_id_2 = req.params['eventId']

    if (event_id) print(event_id)
    else print(event_id_2)
});

// router.post('/event', function(req,res){
//     var event = new Event({
//         title: req.body["name"],
//                 tags: req.body["tags"],
//                 venue: req.body["loc"],
//                 date: req.body["eventDate"],
//                 numberOfParticipants: req.body["quota"],
//                 activityCategory: req.body["category"],
//                 createdAt: req.body["createdOn"] 
//     });
//     console.log(event);
//     event.save(next);
// });

router.delete("/event/:eventID", function(req, res) {
    var id = req.params.eventID
    Event.findOneAndDelete({ eventID: id }, (err, event) => {
        if (err) res.send("Error occured: " + err)
        else if (event == null) {
            res.send("The event does not exist")
        }
        else {
            res.send("Deleted event: " + toString(id))
        }
    })
});

module.exports = router;