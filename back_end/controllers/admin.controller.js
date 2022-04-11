const User = require("../models/user");
const Event = require("../models/event");
var bcrypt = require("bcryptjs");
var ObjectId = require('mongoose').Types.ObjectId;

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

exports.loadRecentUsersAndEvents = (req, res) => {
    User.find({}, {username: 1, sid: 1}).sort({createdAt:-1})
    .exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }
        Event.find({}, {title: 1, eventID: 1}).sort({createdAt:-1})
        .exec((err, event) => {
            if (err) {
                return res.status(500).send({ message: err });
            }
            User.count({ })
            .exec((err, ucount) => {
                if (err) {
                    return res.status(500).send({ message: err });
                }
                Event.count()
                .exec((err, ecount) => {
                    if (err) {
                        return res.status(500).send({ message: err });
                    }
                    return res.status(200).send({ userCount: ucount, eventCount: ecount, users: user, events: event, message: "Successfully loaded 10 recent users and events."});
                })
            })
        })
    })

}

// admin rights on event visit
// ban events (delete profile)
// click button -> enter password (front end) from Dashboard
// POST method, "/event/:eventid/delete", body contents -> adminReqSID, password (of admin id)
exports.deleteEvent = (req, res) => {
  
  let eid = req.params.eventid;
  let adminReqSID = req.body.adminReqSID;
  let adminReqPassword = req.body.adminReqPassword;
  // console.log(adminReqSID, adminReqPassword, eid);

  User.findOne({ sid: adminReqSID })
  .exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    
    var passwordIsValid = bcrypt.compareSync(
      adminReqPassword,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({message: "Invalid Password!" });
    }

    Event.findOneAndDelete({ eventID: eid })
    .exec((err, event) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (!event) {
        return res.status(404).send({ message: "Event Not found." });
      }

      const doc = new Event(event);
      doc.remove();

      console.log("Admin " + adminReqSID + " has deleted event " + eid);
      return res.status(200).send({ message: "Successfully deleted event " + eid + "."})
    })

  });

}

// admin rights on profile visit
// ban user (delete profile)'
// click button -> enter password (front end) from Dashboard
exports.deleteUser = (req, res) => {
  
  let sid = req.params.sid;
  let adminReqSID = req.body.adminReqSID;
  let adminReqPassword = req.body.adminReqPassword;

  User.findOne({ sid: adminReqSID })
  .exec((err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!admin) {
      return res.status(404).send({ message: "Admin Not found." });
    }
    
    var passwordIsValid = bcrypt.compareSync(
      adminReqPassword,
      admin.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({message: "Invalid Password!" });
    }
    
    User.findOneAndDelete({ sid: sid })
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }  

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const doc = new User(user);
      doc.remove();
      console.log("Admin " + adminReqSID + " has deleted user " + sid);
      return res.status(200).send({ message: "Successfully deleted user SID:" + sid + "."})
    })
  });

}

exports.changeUserPass = (req, res) => {
  
  let sid = req.params.sid;
  let adminReqSID = req.body.adminReqSID;
  let adminReqPassword = req.body.adminReqPassword;
  let newPassword = req.body.newUserPass;

  User.findOne({ sid: adminReqSID })
  .exec((err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!admin) {
      return res.status(404).send({ message: "Admin Not found." });
    }
    
    var passwordIsValid = bcrypt.compareSync(
      adminReqPassword,
      admin.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({message: "Invalid Admin Password!" });
    }

    User.findOne({ sid: sid })
    .exec((err, targetUser) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
  
      if (!targetUser) {
        return res.status(404).send({ message: "Target user not found." });
      }

      const salt = bcrypt.genSaltSync(10);
      
      targetUser.password = bcrypt.hashSync(newPassword, salt);
      
      targetUser.save((err) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        console.log("Admin " + adminReqSID + " has changed user " + sid + "\'s password");
        return res.status(200).send({ message: "Successfully updated user password"});
      })
    })

  });

}

// delete comments in event
// how to use?
// POST to url --> http://localhost:8080/admin/event/:eventid/removecomment
// params eventid is target eventid
// body (JSON) --> { "adminReqSID": adminReqSID, "adminReqPassword": adminReqPassword,
// "commentId": commentId  }
// returns success/ fail
exports.removeEventComments = (req, res) => {
  let targetEventId = req.params.eventid;
  let adminReqSID = req.body.adminReqSID;
  let adminReqPassword = req.body.adminReqPassword;
  let commentId = req.body.commentId;

  if (! ObjectId.isValid(commentId)) {
    return res.status(404).send({ message: "Invalid ObjectId "});
  }

  // check if request made by admin
  User.findOne({ sid: adminReqSID })
  .exec((err, admin) => {
    if (err) {
      return res.status(501).send({ message: err });
    }

    if (!admin) {
      return res.status(404).send({ message: "Admin Not found." });
    }
    
    var passwordIsValid = bcrypt.compareSync(
      adminReqPassword,
      admin.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({message: "Invalid Admin Password!" });
    }
  
    let update_comments = {
      $pull: { chatHistory: { _id: commentId } },
    }

    let update_pinned_comments = {
      $pull: { pinnedComment: { _id: commentId } },
    };

    Event.findOne({ chatHistory: { _id: commentId}})
    .exec((err, result) => {
      if (err) {
        console.log(err);
        return res.status(505).send({ message: err });
      }
      // update comments
      Event.updateMany({ eventID: targetEventId }, update_comments)
      .exec((err, result1) => {
        if (err) {
          // console.log(err);
          return res.status(505).send({ message: err });
        }
        // console.log(result1);

        // update pinned comments
        Event.updateMany({ eventID: targetEventId }, update_pinned_comments)
        .exec((err, result2) => {
          if (err) {
            // console.log(err);
            return res.status(506).send({ message: err });
          }
          // console.log(result2);
          if (result1.modifiedCount + result2.modifiedCount === 0) {
            return res.status(404).send({ message: "Failed to delete that comment "});
          }
      
          console.log("Admin " + adminReqSID + " has deleted comment with id " + commentId + " in event " + targetEventId + "\'s page");
          return res.status(200).send({ message: "Successfully removed user comment"});
        })
      })
    })
  })
}

// remove reviews of a user profile
// how to use?
// POST to url --> http://localhost:8080/admin/user/:sid/removerating
// params sid is target sid
// body (JSON) --> { "adminReqSID": adminReqSID, "adminReqPassword": adminReqPassword,
// "commenterSID": commenterSID}
// returns success/ fail
exports.removeUserRating = (req, res) => {
  let targetSID = req.params.sid;
  let adminReqSID = req.body.adminReqSID;
  let adminReqPassword = req.body.adminReqPassword;
  let commenterSID = req.body.commenterSID;

  // check if request made by admin
  User.findOne({ sid: adminReqSID })
  .exec((err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!admin) {
      return res.status(404).send({ message: "Admin Not found." });
    }
    
    var passwordIsValid = bcrypt.compareSync(
      adminReqPassword,
      admin.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({message: "Invalid Admin Password!" });
    }

    // find if user profile exists (if the corresponding SID exists)
    User.findOne({ sid: targetSID })
    .exec((err, targetUser) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!targetUser) {
        return res.status(404).send({ message: "Target user not found." });
      }

      // get all comments
      let allComments = targetUser.reviewHistory;
      let hasLeftComment = allComments.some(allComments => allComments.user == commenterSID)
      // if targetCommentSID found as one of the commenter
      if (hasLeftComment) {
        // get index of comment
        let indexOfOldComment = allComments.findIndex(x => x.user == commenterSID);
        // console.log(indexOfOldComment);
        let newComments = allComments;
        newComments.splice(indexOfOldComment, 1);
        targetUser.reviewHistory = newComments;

        targetUser.save((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          console.log("Admin " + adminReqSID + " has deleted " + commenterSID + "\'s comment in " + targetSID + "\'s profile");
          return res.status(200).send({ message: "Successfully removed user comment"});
        })
      }
      else {
        return res.status(404).send({ message: "That user have not left a comment on the targetUser's profile "});
      }
    })
  });
}
