const router = require("express").Router();
const Event = require("../models/event")
const moment = require("moment")

router.post("/create-event", async(req,res)=> {
    const event = Event(req.body);
    await event.save()
    
})

router.post("/get-event", async(req,res)=> {
    const event = await Event.find({
        start: {$gte: moment(req.query.start).toDate()}, 
        end: {$gte: moment(req.query.end).toDate()},
    })
    
    res.send(event);
});

module.exports = router;