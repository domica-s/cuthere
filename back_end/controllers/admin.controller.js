// The program for the backend of admin functions
// PROGRAMMER: Domica
// This controller file is used to handle the functionalities of the admin functions
// Revised on 5/5/2022

const User = require("../models/user");
const Event = require("../models/event");
var bcrypt = require("bcryptjs");
var ObjectId = require('mongoose').Types.ObjectId;


exports.getSID = (req, res) => {
  /*
  This function gets a specific user through querying the SID
  Requirements: Pass SID in params as admin
  */

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
    /*
    This function gets a specific Event through querying the EventID
    Requirements: Pass EventID in params as admin
    */
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
      /*
      This function loads recent users and events
    */
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

exports.deleteEvent = (req, res) => {
        /*
      This function deletes a specific event through a button click
      Requirements (Body): pass admin's sid ass adminReqSID in the body and admin's password as adminReqPassword in the body
      Requirements (Params)): pass the to be deleted event's id as eventid in params
    */
  
  let eid = req.params.eventid;
  let adminReqSID = req.body.adminReqSID;
  let adminReqPassword = req.body.adminReqPassword;


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


exports.deleteUser = (req, res) => {
        /*
      This function deletes a specific users from a button click 
      Requirements (Body): pass admin's sid ass adminReqSID in the body and admin's password as adminReqPassword in the body
      Requirements (Params)): pass the to be deleted user's sid as sid in the params
    */
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
          /*
      This function changes password of a specific user
      Requirements (Body): pass 1) Admin's sid as adminReqSID, 2) admin's password as adminReqPassword, and 3) new password as newUserPass in body
      Requirements (Params)): pass the to sid of the user whose password is to be changed as sid in the params
    */
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


exports.removeEventComments = (req, res) => {
          /*
      This function removes a specific comment in the event
      Requirements (Body): pass the 1) admin's SID as adminReqSID, 2) admin's password as adminReqPassword, and 3) the id of the comment to be changed as commentId in the body
      Requirements (Params)): pass the to be event id of the to be deleted comment as eventid in the params
    */
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

          return res.status(505).send({ message: err });
        }


        // update pinned comments
        Event.updateMany({ eventID: targetEventId }, update_pinned_comments)
        .exec((err, result2) => {
          if (err) {

            return res.status(506).send({ message: err });
          }

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


exports.removeUserRating = (req, res) => {
            /*
      This function removes a review from the user profile
      Requirements (Body): pass the 1) admin's SID as adminReqSID, 2) admin's password as adminReqPassword, and 3) the sid of the commentor to be changed as commentorSID in the body
      Requirements (Params)): pass the sid of the commented user as sid in the params
    */
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
    

    User.findOne({ sid: targetSID })
    .exec((err, user) => {

      let getCommentObj = (user.reviewHistory).find(x => x.user == commenterSID)

      let update_rating = {
        $inc: { posRating: -1 },
      }

      if (getCommentObj.type === true) {
  
      }
      else {

          update_rating = {
              $inc: { negRating: -1 },
          }
      }

      User.findOneAndUpdate({ sid: targetSID }, update_rating)
      .exec((err, result) => {
        if (err) {
            console.log("mongoDB error in remove rating score: " + err);
        }

        let update_reviews = {
          $pull: { reviewHistory: { user: commenterSID } },
        }
    
        User.findOneAndUpdate({ sid: targetSID }, update_reviews)
        .exec((err, result) => {
          if (err) {
            return res.status(506).send({ message: err });
          }
          
          // update result
          console.log("Admin " + adminReqSID + " has deleted " + commenterSID + "\'s comment in " + targetSID + "\'s profile");
          return res.status(200).send({ message: "Successfully removed user comment"});
        })
      })
    })

    

  });
}
