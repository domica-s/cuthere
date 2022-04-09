const User = require("../models/user");

// get user profile details
exports.getUserProfile = (req, res) => {
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
        });
    });
}

// leave comment on user profile
// how to use?
// POST to url --> http://localhost:8080/user/:sid/comment
// params sid is target sid
// body (JSON) --> { "sid": sid, "content": content, "type": type }
// returns --> success, fail1 (user have previously left a comment, update instead)
//, fail2 (source/target sid not found, no similar events or other errors)
// exports.leaveUserRating = (req, res) => {

//     let sourceSID = req.body.sid;
//     let targetSID = req.params.sid;
//     let type = req.body.type; // good or bad rating (true for good)
//     let content = req.body.content;

//     console.log(req.body)
//     console.log(req.params.sid)

//     User.findOne({ sid: targetSID })
//     .exec((err, targetUser) => {
//         if (err) {
//             return res.status(500).send({ message: err });
//         }
        
//         if (!targetUser) {
//             console.log("Can't find the guy!")
//             return res.status(404).send({ message: "Target user not found "});
//         }

//         User.findOne({ sid: sourceSID })
//         .exec((err, sourceUser) => {
//             if (err) {
//                 console.log("Second Error")
//                 return res.status(500).send({ message: err});
//             }

//             if (!sourceUser) {
//                 console.log("Can't find who wrote this thing man!")
//                 return res.status(404).send({ message: "Source user not found "});
//             }

//             // if their events are not empty
//             if (sourceUser.registeredEvents && targetUser.registeredEvents) {
//                 // if they share similar events
//                 let sameEvent = 0;
//                 sourceUser.registeredEvents.forEach((item, index) => {
//                   targetUser.registeredEvents.forEach((item1, index1) => {
//                     if (item.event.equals(item1.event)) {
//                       sameEvent = 1;
//                     }
//                   })
//                 })

//                 if (sameEvent === 1) {
//                   console.log("The users share the same event brother!")
//                 // if (sourceUser.registeredEvents.some(i => targetUser.registeredEvents['event'] == i['event'])) {
//                     // if they left a comment before
//                     // cannot comment anymore
//                     let targetHistory = targetUser.reviewHistory;
//                     let hasLeftComment = targetHistory.some(targetHistory => targetHistory.user === sourceSID)
//                     if (hasLeftComment) {
//                         console.log("You left a comment already brother I'm sorry!")
//                         return res.status(404).send({ message: "You have previously left a comment, update your comment instead."});
//                     }

//                     //  not yet left comment before
//                     // can comment
//                     let commentObj = {"user": sourceSID, "type": type, "content": content}
//                     const reviewHistory = [...targetUser.reviewHistory, commentObj]
                    

//                     // Use FindOneAndUpdate
//                     User.findOneAndUpdate({sid: targetSID}, {$push:{reviewHistory: reviewHistory}}).exec(function(err, result){
//                       if (err) res.status(400).send({message:"Error Occured: "+ err})
//                       else res.status(200).send({message: "Review Added!", response: result, sourceSID: sourceSID})
//                     })

//                     // Dom's method below
//                     // targetHistory.push(commentObj);
//                     // targetUser.reviewHistory = targetHistory;

//                     // targetUser.save((err) => {
//                     //     if (err) {
//                     //         return res.status(500).send({message: err});
//                     //     }
                  
//                     //     // console.log(targetUser.registeredEvents);
//                     //     return res.status(200).send({ sourceSID: sourceSID, message: 'Your comment has been added successfully'});
//                     // })
//                 }
//                 else {
//                     return res.status(404).send({ message: "You do not share any similar events with the target user"});
//                 }
//             }
//             else {
//                 return res.status(404).send({ message: "Source/ target user does not have any events registered"});
//             }
//         })
//     })
// }


// add comment on user profile
// how to use?
// POST to url --> http://localhost:8080/user/:sid/comment/update
// params sid is target sid
// body (JSON) --> { "sid": sid, "type": type, content": content}
// returns --> success
//, fail (source/target sid not found, no similar events or other errors)
exports.leaveUserRating = async (req, res) => {
    let sourceSID = req.body.sid;
    // console.log(sourceSID);
    let targetSID = req.params.sid;
    // console.log(targetSID);
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
                            targetUser.rating = targetUser.rating - 1;
                          }
                          else {
                            targetUser.rating = targetUser.rating + 1;
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
                              console.log("Domeki")
                              return res.status(500).send({message: err});
                          }
                          
                          return res.status(200).send({ response: targetUser, message: 'You have commented successfully'});
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
                //console.log(sourceUser._id.toString(), follower_id.toString());
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
        //console.log(sourceUser._id.toString(), follower_id.toString());
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

// POST request with college in body
exports.recommendedFriendsCollege = (req, res) => {
  let sid = req.body.sid;
  let college = req.body.college;
  // console.log("called1");
  User.count({ sid: { $ne: req.body.sid }, college: college })
  .exec((err, count) =>  {
    if (err) {
      res.status(400).send({ message: err });
    }
    // console.log("called college1");
    var random = Math.floor(Math.random() * count);

    User.find({ sid: { $ne: sid }, college: college }, { sid: 1, name: 1, college: 1, interests: 1 }).skip(random).limit(2)
    .exec((err, users) => {
      if (err) {
        return res.status(400).send({ message: err });
      }
      if (!users) {
        return res.status(404).send({ message: "No users found" });
      }
      // console.log("called college2");
      // console.log(users);
      return res.status(200).send({ fromCollege: users });
    })
  })

}

// POST request with sid in body
exports.recommendedFriendsInterests = async (req, res) => {
  try {
    // console.log("called2");
    await User.findOne({ sid: req.body.sid })
    .exec((err, sourceUser) => {
      if (err) {
        res.status(400).send({ message: err });
      }
      // console.log(sourceUser);
      // console.log(sourceUser.interests);
      User.count({ sid: { $ne: req.body.sid }, interests: { "$in": sourceUser.interests } })
      .exec((err, count) => {
        // console.log(sourceUser.interests);
        // console.log(count);
        if (err) {
          res.status(400).send({ message: err });
        }
        // console.log("called interests1");
        var random = Math.floor(Math.random() * count);
        
        User.find({ sid: { $ne: req.body.sid }, interests: { "$in": sourceUser.interests} }, { sid: 1, name: 1, college: 1, interests: 1 }).skip(random).limit(4)
        .exec((err, users) => {
          if (err) {
            res.status(400).send({ message: err });
          }
          if (!users) {
            return res.status(404).send({ message: "No users found" });
          }
          // console.log("called interests2");
          // console.log(users);
          return res.status(200).send({ fromInterests: users });
        })
      })
    })
  }
  catch {
    return res.status(404).send({message: "Failed fetching data"});
  }
}