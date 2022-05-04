// The program for the backend of several user functions
// PROGRAMMER: Domica, Bryan, Philip, Pierson, Ethan
// This controller file is used to handle the functionalities related to user
// Revised on 5/5/2022

const User = require("../models/user");

// get user profile details
exports.getUserProfile = (req, res) => {
                /*
      This function is used to get specific user profile details
      Requirements (params): pass the user sid as sid in the params
      */
    User.findOne({sid:req.params.sid}).exec(function(err, user){
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (!user) {
            return res.status(404).send({ message: "User not found "});
        }

        return res.status(200).send({
            message: "Successfully retrieved user data",
            sid: user.sid,
            username: user.username,
            email: user.email,
            mobileNumber: user.mobileNumber,
            profilePicture: user.profilePicture,
            interests: user.interests,
            college: user.college,
            about: user.about,
            rating: user.rating,
            following: user.following,
            followers: user.followers,
            role: user.role,
            reviewHistory: user.reviewHistory,
            birthday: user.birthday,
            country: user.country,
            name: user.name,
            posRating: user.posRating,
            negRating: user.negRating,
        });
    });
}

// add comment on user profile
// how to use?
// POST to url --> http://localhost:8080/user/:sid/comment/
// params sid is target sid
// body (JSON) --> { "sid": sid, "type": type, content": content}
// returns --> success
//, fail (source/target sid not found, no similar events or other errors)
exports.leaveUserRating = async (req, res) => {
                /*
      This function is used to leave user rating
      Requirements (body): pass the 1) user sid as sid, 2) rating type as type, and 3) rating contents as content in the body
      Requirements (params): pass the target user sid as sid in the params
    */

    let sourceSID = req.body.sid;

    let targetSID = req.params.sid;

    let type = req.body.type; // good or bad rating

    let writerName = req.body.name
    let content = req.body.content;
    try {
      User.findOne({ sid: targetSID })
      .exec((err, targetUser) => {
          if (err) {
              return res.status(500).send({ message: err });
          }

          if (!targetUser) {
              return res.status(404).send({ message: "Target user not found "});
          }

          User.findOne({ sid: sourceSID })
          .exec((err, sourceUser) => {
              if (err) {
                  return res.status(500).send({ message: err});
              }

              if (!sourceUser) {
                  return res.status(404).send({ message: "Source user not found "});
              }

              if (sourceUser === targetUser) {
                return res.status(404).send({ message: "Cannot comment on your own profile "});
              }

              // if their events are not empty
              if (sourceUser.registeredEvents && targetUser.registeredEvents) {
                  // console.log(sourceUser.registeredEvents);
                  // console.log(targetUser.registeredEvents);
                  // if they share similar events
                  let sameEvent = 0;
                  sourceUser.registeredEvents.forEach((item, index) => {
                    targetUser.registeredEvents.forEach((item1, index1) => {
                      // console.log(item.event);
                      // console.log(item1.event);
                      if (item.event.equals(item1.event)) {
                        sameEvent = 1;
                      }
                    })
                  })

                  if (sameEvent === 1) {
                      
                      let targetHistory = targetUser.reviewHistory;
                      let hasLeftComment = targetHistory.some(targetHistory => targetHistory.user === sourceSID)
                      // if they left a comment before
                      // change old comment to new one
                      if (hasLeftComment) {
                          let commentObj = {"user": sourceSID, "name": writerName, "type": type, "content": content}
                          // get old comments, find and replace object with user sourceSID
                          let indexOfOldComment = targetHistory.findIndex(x => x.user === sourceSID);
                          // get rating of oldComment
                          if (targetHistory[indexOfOldComment].type === true) {
                            targetUser.posRating = targetUser.posRating - 1;
                          }
                          else {
                            targetUser.negRating = targetUser.negRating - 1;
                          }
                          // console.log(indexOfOldComment);
                          let newTargetHistory = targetHistory;
                          newTargetHistory[indexOfOldComment] = commentObj;
                          targetUser.reviewHistory = newTargetHistory;

                          if (type === true) {
                            // console.log("gave good rating");
                            targetUser.posRating = targetUser.posRating + 1;
                          }
                          else {
                            // console.log("gave bad rating");
                            targetUser.negRating = targetUser.negRating + 1;
                          }

                          targetUser.save((err) => {
                              if (err) {
                                  return res.status(500).send({message: err});
                              }

                              // console.log(targetUser.registeredEvents);
                              return res.status(200).send({ response: targetUser, message: 'Your comment has been updated successfully'});
                          })
                      }
                      // not yet left comment before
                      // create new comment
                      else {
                        let commentObj = {"user": sourceSID, "name": writerName, "type": type, "content": content}
                        let newTargetHistory = targetHistory;
                        newTargetHistory.push(commentObj);
                        targetUser.reviewHistory = newTargetHistory;

                        if (type === true) {
                          // console.log("gave good rating");
                          targetUser.posRating = targetUser.posRating + 1;
                        }
                        else {
                          // console.log("gave bad rating");
                          targetUser.negRating = targetUser.negRating + 1;
                        }

                        // Sort the review History
                        targetUser.reviewHistory.sort((a,b) => b.reviewAt - a.reviewAt)
                        
                        targetUser.save((err) => {
                          if (err) {
                              // console.log("Domeki")
                              return res.status(500).send({message: err});
                          }
                          sourceUser.save((err) => {
                            if (err) {
                              return res.status(500).send({message: err});
                            }
                            return res.status(200).send({ response: targetUser, message: 'You have commented successfully'});
                          })
                      })
                        
                      }
                  }
                  else {
                    
                      res.status(404).send({ message: "You do not share any similar events with the target user"});
                  }
              }
              else {
                  return res.status(404).send({ message: "Source/ target user has not registered for an event."});
              }
          })
      })
    }
    catch (err) {
      throw err;
    }
}

exports.followUser = (req,res) => {
                /*
      This function is used to follow a specific user
      Requirements (params): pass the following user SID as sid in the params  
      Requirements (body): pass the 1) follower user SID as sid in the body
    */
    let followerID = req.body.sid;
    let followingID = req.params.sid;

    User.findOne({sid: followingID}).exec((err, userToFollow) => {
        if (err) {
          res.status(400).send({ message: "error occured: " + err });
        } else if (userToFollow === null) {
          res.status(404).send({ message: "User not found" });
        }
        User.findOne({sid: followerID}).exec((err, sourceUser) =>{
            if (err) {
              res.status(400).send({ message: "error occured: " + err });
            } else if (sourceUser === null) {
              res.status(404).send({ message: "User not found" });
            }
            let followed = false;
            //User to follow's followers list
            let followerList = userToFollow.followers;
            for (let i = 0; i < followerList.length; i++) {
                let follower_id = followerList[i];

                //compare string representation of objectId
                if (sourceUser._id.toString() == follower_id.toString()) {
                  followed = true;
                }
            }
            if(followed){
                res.status(202).send({message: "You have followed this user"});
            }
            else{
                //Source user's followings list
                let followingList = sourceUser.following;
                followerList.push(sourceUser);
                followingList.push(userToFollow);

                userToFollow.save((err)=>{
                    if (err) {
                      return res.status(500).send({ message: err });
                    }
                })
                sourceUser.save((err)=>{
                    if (err) {
                      return res.status(500).send({ message: err });
                    }
                })
                res.status(200).send({message: "Success!"});
            }

        })

    })
}

exports.unfollowUser = (req, res) => {
                  /*
      This function is used to unfollow a specific user
      Requirements (params): pass the following user SID as sid in the params  
      Requirements (body): pass the 1) follower user SID as sid in the body
    */

  let followerID = req.body.sid;
  let followingID = req.params.sid;

  User.findOne({ sid: followingID }).exec((err, userToUnfollow) => {
    if (err) {
      res.status(400).send({ message: "error occured: " + err });
    } else if (userToUnfollow === null) {
      res.status(404).send({ message: "User not found" });
    }
    User.findOne({ sid: followerID }).exec((err, sourceUser) => {
      if (err) {
        res.status(400).send({ message: "error occured: " + err });
      } else if (sourceUser === null) {
        res.status(404).send({ message: "User not found" });
      }
      let followed = false;
      //User to follow's followers list
      let followerList = userToUnfollow.followers;
      for (let i = 0; i < followerList.length; i++) {
        let follower_id = followerList[i];

        //compare string representation of objectId
        if (sourceUser._id.toString() == follower_id.toString()) {
          followed = true;
        }
      }
      if (!followed) {
        res.status(202).send({ message: "You have not followed this user" });
      } else {
        //Source user's followings list
        let followingList = sourceUser.following;
        followerList.pull(sourceUser);
        followingList.pull(userToUnfollow);

        userToUnfollow.save((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
        });
        sourceUser.save((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
        });
        res.status(200).send({ message: "Success!" });
      }
    });
  });
};


exports.recommendedFriendsCollege = (req, res) => {
                  /*
      This function is used to see the college of a user's recommended friends
      Requirements (body): pass the 1) college as college, 2) follower user SID as sid in the body
    */
  let sid = req.body.sid;
  let college = req.body.college;
  // console.log("called1");
  User.findOne({ sid: req.body.sid })
  .exec((err, user) => {
    if (err) {
      res.status(400).send({ message: err });
    }

    User.count({ sid: { $ne: req.body.sid }, _id: { $nin: user.following }, college: college })
    .exec((err, count) =>  {
      if (err) {
        res.status(400).send({ message: err });
      }

      var random = Math.floor(Math.random() * count);

      User.find({ sid: { $ne: sid }, _id: { $nin: user.following }, college: college }, { sid: 1, name: 1, college: 1, interests: 1 }).skip(random).limit(2)
      .exec((err, users) => {
        if (err) {
          return res.status(400).send({ message: err });
        }
        if (!users) {
          return res.status(404).send({ message: "No users found" });
        }

        return res.status(200).send({ fromCollege: users });
      })
    })    
  })

}


exports.recommendedFriendsInterests = async (req, res) => {
                    /*
      This function is used to see recommended friends based on interests
      Requirements (body): user SID as sid in the body
    */
  try {
    await User.findOne({ sid: req.body.sid })
    .exec((err, sourceUser) => {
      if (err) {
        res.status(400).send({ message: err });
      }

      User.count({ sid: { $ne: req.body.sid }, _id: { $nin: sourceUser.following }, interests: { "$in": sourceUser.interests } })
      .exec((err, count) => {

        if (err) {
          res.status(400).send({ message: err });
        }

        var random = Math.floor(Math.random() * count);

        User.find({ sid: { $ne: req.body.sid }, _id: { $nin: sourceUser.following }, interests: { "$in": sourceUser.interests} }, { sid: 1, name: 1, college: 1, interests: 1 }).skip(random).limit(4)
        .exec((err, users) => {
          if (err) {
            res.status(400).send({ message: err });
          }
          if (!users) {
            return res.status(404).send({ message: "No users found" });
          }

          return res.status(200).send({ fromInterests: users });
        })
      })
    })
  }
  catch {
    return res.status(404).send({message: "Failed fetching data"});
  }
}

// POST request with sid in body
exports.getFollowersFollowing = (req, res) => {
                    /*
      This function is used to get a followers' following
      Requirements (body): pass the user sid as sid in the body
    */

  User.findOne({ sid: req.body.sid })
  .exec((err, sourceUser) => {
    if (err) {
      res.status(400).send({ message: err });
    }

    User.find({ _id: { $in: sourceUser.following}}, { sid: 1, name: 1})
    .exec((err, following) => {
      if (err) {
        res.status(400).send({ message: err });
      }

      User.find({ _id: { $in: sourceUser.followers}}, { sid: 1, name: 1})
      .exec((err, followers) => {
        if (err) {
          res.status(400).send({ message: err });
        }
        
        return res.status(200).send({ following: following, followers: followers, message: "Successfuly retrieved folls"});
      })
    })
  })
}