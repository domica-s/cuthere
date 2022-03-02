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

router.set('view engine', 'ejs') 
router.set('views', path.join(__dirname,'app views'))

// // create events
// app.post("/create", function(req,res){
//     // Need testing

//     // Searches for the Event database to find the latest tag
//     var latest_tag = Event.find().sort({tags: -1}).limit(1); 

//     latest_tag.exec(function(err, event_tag){
//         if(err) res.send("The error is " + err); 
//         else {
            
//             var tag = 1;
//             if (event_tag.length > 0) tag = event_tag[0].event_tag + 1; 

//             var event = new Event({
//                 title: req.body["name"],
//                 tags: tag, 
//                 venue: req.body["loc"],
//                 date: req.body["eDate"],
//                 numberOfParticipants: req.body["quota"], 
//                 activityCategory: req.body["category"],
//                 createdAt: req.body["createdOn"]
//             });

//             event.save(function (err) {
//                 if (err) res.send("The error is: " + err);
//                 else {
//                     res.status(201); // send status
//                     res.send("Event with tag "+ tag +" been created!")
        
//                 }
//             });

//         }
//     })

// })

router.post('/event', function(req,res){
    var event = new Event({
        title: req.body["name"],
                tags: req.body["tags"],
                venue: req.body["loc"],
                date: req.body["eventDate"],
                numberOfParticipants: req.body["quota"],
                activityCategory: req.body["category"],
                createdAt: req.body["createdOn"] 
    });
    console.log(event);
    event.save(next);
});

module.exports = router;