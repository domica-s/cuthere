const User = require("../models/user");
const Event = require("../models/event");

// admin dashboard, query sid and event id
exports.getSID = (req, res) => {
    // pass sid in params
    // authenticated route (admin only)
    let reqSID = req.params.sid;
    User.findOne({
        sid: reqSID
      })
      .exec((err, user) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
    
        return res.status(200).send({ user: user, message: "Successfully queried user."});
      });
}

exports.getEventId = (req, res) => {
    // pass eventId in params
    // authenticated route (admin only)
    let reqEventId = req.params.eventid;
    Event.findOne({
        eventID: reqEventId
      })
      .exec((err, event) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        
        if (!event) {
          return res.status(404).send({ message: "Event Not found." });
        }

        return res.status(200).send({ event: event, message: "Successfully queried event."});
      });
}

exports.loadRecentUsers = (req, res) => {
    
}

// admin rights on event visit
// ban events (delete profile)
exports.adminEvent = (req, res) => {

}

// delete comments 

// admin rights on profile visit
// ban user (delete profile)
// remove reviews