// The code is the routes for implementation for an event detail's related functionalities
// PROGRAMMER: Philip
// Revised on 5/5/2022

var express = require("express");
var mongoose = require("mongoose");

var Event = require("../models/event");
var User = require("../models/user");

var router = express.Router();

const res = require("express/lib/response");

const { authJwt } = require("../middlewares");
const { update } = require("../models/event");

const nodemailer = require('nodemailer');
const sendgridTransport = require("nodemailer-sendgrid-transport");
var params = require("../params/params");


function checkRegistered(user_id, participants){
    const stringParticipants = participants.map( x => x.toString()) 

    if (stringParticipants.includes(user_id)) return true
    else return false

}


function sendReminder(to_email, email_body) {
                    /*
      This function is used to send reminder to the participants of an event
      Requirements (parameters): to_email is the receiver's email and email_body is the content of the email
    */

    let subject = "Reminder for registered event";

    var transporter = nodemailer.createTransport(
        sendgridTransport({
            auth: {
                api_key: params.SENDGRID_APIKEY,
            }
        })
    )

    var mailOptions = {
        from: 'noreply.cuthere@gmail.com',
        to: to_email,
        subject: subject,
        text: email_body
    };
    transporter.sendMail(mailOptions, function(err) {
        if (err) {
            console.log(err);
            return false;
        }
        return true
    });
}


// Register Events --> WORKING
router.post('/event/register/:eventID', [authJwt.verifyToken], function (req, res){
                        /*
      This function is used to register an event
      Requirements (params): Include the event id as eventID in the params
      Requirement(body): Include 1) The user's object id as id in the body
    */

    // Acquire parameters
    const eventID = req.params.eventID
    const userID = req.body.id // This is an ObjectID
    var eventName = "";
    var eventTime = "";

    // Find event with the corresponding Event Id 
    Event.findOne({eventID: eventID}).exec(function(err, result){

        if (err) res.status(400).send("Error is: "+ err)

        else if (result === null) res.status(400).send({message:"There are no such event"})
        
        
        else if (!checkRegistered(userID,result.participants)){ 
            if(result.numberOfParticipants >= result.quota) res.status(201).send({message:'Sorry! This event is already full!'})

            else{ 
                // Update the parameters
                result.participants.push(userID)
                const numberOfParticipants = result.numberOfParticipants + 1
                Event.findOneAndUpdate({eventID: eventID}, {$set: {numberOfParticipants: numberOfParticipants, participants : result.participants}}, function(err, doc){
                    if(err) res.status(404).send({message:"Error Ocurred "+ err})
                    else {
                        var timeNow = Date(Date.now());
                        var eventName = doc.title;
                        var eventTime = doc.start.toString();

                        var entry = {
                            $push: { registeredEvents:{
                                event: doc,
                                registeredAt: timeNow
                            }}
                        }
                        User.findOneAndUpdate({_id: userID}, entry, (err, ress)=>{
                            var followers = ress.followers;

                            // send reminder
                            var user_email = ress.email;
                            var userName = ress.username;
                            var reminder_body = "Hi " + userName + ",\n\n  Here is a reminder for the event you registered:\n\n";
                            reminder_body += "Event Name: " + eventName + "\n";
                            reminder_body += "Event Time: " + eventTime + "\n";
                            reminder_body += "Remember to participate on time and have fun!\n\n"
                            reminder_body += "Warm regards, \nCUthere Development Team"

                            var emailSent = sendReminder(user_email, reminder_body);

                            if (err) {
                                res.status(400).send({ message: "error occured: " + err});
                            }
                            else{
                                console.log("Updated The Database !"); 
                            }
                            var activity = {
                                $push: {
                                    feedActivities: {
                                        friend: ress.username,
                                        sid: ress.sid,
                                        event: doc.title,
                                        eid: doc.eventID,
                                        timestamp: timeNow,
                                        type: "Register"
                                    },
                                },
                            };
                            for(var f in followers){
                                var curFollowers = followers[f].toString();
                                console.log("followers", followers[f].toString());
                                User.findOneAndUpdate({_id: curFollowers}, activity, (err, fuser)=>{
                                    if (err) {
                                        res.status(400).send({ message: "error occured: " + err});
                                    }
                                    else{
                                        console.log("Updated your followers!");
                                    }
                                })
                            }
                            res.status(200).send({message: "OK"});
                        })
                    }
                })
            }
        }
        else res.status(202).send("You have already registered for this event!")
    })
})


router.post('/event/unregister/:eventID', [authJwt.verifyToken], function (req, res){
        /*
      This function is used to unregister from an event
      Requirements (params): include the event's id as eventID in the params
      Requirements (body): include 1) User's object id as id in the body
    */

    // Acquire parameters
    const eventID = req.params.eventID
    const userID = req.body.id // This is an ObjectID

    // Find event with the corresponding Event Id 
    Event.findOne({eventID: eventID}).exec(function(err, result){

        if (err) res.status(400).send("Error is: "+ err)

        else if (result === null) res.status(400).send({message:"There are no such event"})
        
        else if (checkRegistered(userID,result.participants)){ 
                // Update the parameters
                result.participants.remove(userID)
                const numberOfParticipants = result.numberOfParticipants - 1

                Event.findOneAndUpdate({eventID: eventID}, {$set: {numberOfParticipants: numberOfParticipants, participants : result.participants}}, function(err, doc){
                    if(err) res.status(404).send({message:"Error Ocurred "+ err})
                    else {
                        var update = {
                            $pull: 
                            { registeredEvents :
                                { event: doc}
                            }
                        }
                        User.findOneAndUpdate({_id: userID}, update, (err, ress)=>{
                            var followers = ress.followers;
                            if (err) {
                                res.status(400).send({ message: "error occured: " + err});
                            }
                            else{
                                console.log("Updated The Database !"); // Please change this
                            }
                            var activity = {
                                $pull: {
                                    feedActivities: 
                                    {sid: ress.sid, eid: doc.eventID}
                                },
                            };
                            for(var f in followers){
                                var curFollowers = followers[f].toString();
                                console.log(followers[f].toString());
                                User.findOneAndUpdate({_id: curFollowers}, activity, (err, fuser)=>{
                                    if (err) {
                                        res.status(400).send({ message: "error occured: " + err});
                                    }
                                    else{
                                        console.log("Updated your followers!");
                                    }
                                })
                            }
                            res.status(200).send({message: "OK"});
                        })
                    }
                })
            }
        else res.status(200).send({message:"You are not registered for this event"})
    })
})


router.post('/event/update/:eventID', [authJwt.verifyToken], function(req,res){
                        /*
      This function is used to update a specific element of an event
      Requirements (params): include the event's id as eventID in the params
      Requirements (Body): include the user's object id as id and update parameter as update in the body
    */
    
    //Acquire Parameters
    const eventID = req.params.eventID 
    const userID = req.body.id
    const updateParam = req.body.update // This parameter should give something like {status:"Closed"}

    Event.findOne({eventID: eventID}).exec(function(err, result){
        if(err) res.status(400).send({message:"Error Occured: " + err})

        else if (result.createdBy != userID ) res.status(200).send({message: "You have no authority to update this event"})
        
        else { 
            Event.findOneAndUpdate({eventID:eventID}, {$set:updateParam}).exec(function(err, result){
                if(err) res.status(400).send({message:"Error occured: "+ err})
                else res.status(200).send({message:"The database is updated! ", data: result}) 
            })
        }
    })
})



router.post('/event/delete/:eventID',[authJwt.verifyToken], function(req,res){
        /*
      This function is used to delete an event
      Requirements (params): include the event's id as eventID in the params
      Requirements (Body): include the user's object id as id in the body
    */

    // Acquire Parameters
    const eventID = req.params.eventID
    const userID = req.body.id

    Event.findOne({eventID:eventID}).exec(function(err, result, next){
        if(err) res.status(400).send({message:"Error Occured: "+ err})

        else if (result.createdBy != userID) res.status(200).send({message: "You have no authority to delete this event!"})

        else {
            Event.findOneAndDelete({eventID:eventID}).exec(function (err, result){
                if(err) return res.status(400).send({message: "Error Occured: "+ err})
                else if (result === null) return res.status(200).send({message:"There are no such events"})
                else {
                    const doc = new Event(result);
                    doc.remove();
                    return res.status(200).send({message:"Event is deleted!", status: 'SUCCESS'})} 
            })
        }
    })
})


router.post('/event/addcomment/:eventID', [authJwt.verifyToken], function (req,res){
                            /*
      This function is used to add comments to an event 
      Requirements (params): include the event's id as eventID in the params
      Requirements (Body): include the user's object id as id and comment object as comment in the body
    */

    const eventID = req.params.eventID 
    const comment = req.body.comment


    Event.findOne({eventID: eventID}).exec(function(err,result){
        if(err) res.status(200).send({message: "Error occured: "+ err})

        else {
            let chatHistory = [...result.chatHistory,comment]

            // Sort the ChatHistory according to date
            const sortedChatHistory = chatHistory.sort((a,b) => b.chatAt - a.chatAt)

            // Update the dB
            Event.findOneAndUpdate({eventID: eventID}, {$set: {chatHistory: sortedChatHistory}}).exec(function(err, result){
                if(err) res.status(400).send({message:"Error Occured: "+ err})
            })
            
            // send the updated dB to the caller 
            Event.findOne({eventID: eventID}).exec(function (err,result){
                if (err) res.status(400).send("Error occured: "+ err)
                else{
                    res.status(200).send({message:"Comment Added!", response: result})
                }
            })
            
        }
    })
})


router.post('/event/fav/:eventID', [authJwt.verifyToken], function (req,res){
        /*
      This function is used to set an event as one of the user's favorite events
      Requirements (params): include the event's id as eventID in the params
      Requirements (Body): include the user's object id as id in the body
    */

    const eventID = req.params.eventID
    const userID = req.body.id 

    User.findOne({_id: userID}).exec(function (err, resultUser){
        if(err) res.status(200).send({message:"Error occured: "+ err})
        else {
            // Get the event
            Event.findOne({eventID: eventID}).exec(function(err, resultEvent){
                if (err) res.status(200).send({message: "Error Occured: "+ err})

                // Check if the event is already in your starred list 
                if (resultUser.starredEvents.includes(resultEvent._id))
                res.status(200).send({message: "You have already added this event on your starred list!"})
        
                else {
                    
                    User.findOneAndUpdate({_id: userID},{$set:{starredEvents: [...resultUser.starredEvents,resultEvent._id]}}).exec(function (err, result){
                        if(err) res.status(400).send({message: "Error Occured: "+ err})
                        else res.status(200).send({message: "The event has been added to your fav list!", response: result})
                    })
                }
            })
        }
    })
})


router.post('/event/noFav/:eventID', [authJwt.verifyToken], function (req,res){
            /*
      This function is used to remove an event from one of the user's favorite events
      Requirements (params): include the event's id as eventID in the params
      Requirements (Body): include the user's object id as id in the body
    */

    const eventID = req.params.eventID
    const userID = req.body.id 
    User.findOne({_id: userID}).exec(function (err, resultUser){
        if(err) res.status(200).send({message:"Error occured: "+ err})
        else {
            // Get the event
            Event.findOne({eventID: eventID}).exec(function(err, resultEvent){
                
  
                if (err) res.status(400).send({message: "Error Occured: "+ err})

                // Check if the user have the event starred
                if (!resultUser.starredEvents.includes(resultEvent._id))
                res.status(200).send({message: "You have not added this event as your favorite"})
        
                else {
                    // Remove the event from the starred
                    let starred = resultUser.starredEvents
                    starred.remove(resultEvent._id)
                    
  
                    // Update the user
                    User.findOneAndUpdate({_id: userID},{$set:{starredEvents:starred}}).exec(function (err, result){
                        if(err) res.status(400).send({message: "Error Occured: "+ err})
                        else res.status(200).send({message: "The event has been removed to your fav list!", response: result})
                    })
                }
            })
        }
    })

})


router.post('/event/pin/:eventID', [authJwt.verifyToken], function (req,response){
                /*
      This function is used to pin a comment 
      Requirements (params): include the event's id as eventID in the params
      Requirements (Body): include the comment as comment in the body
    */
   
    const eventID = req.params.eventID
    const comment = req.body.comment  

    Event.findOne({eventID:eventID}).exec(function(err, res){
        if(err) response.status(400).send({message:"Error occured: "+ err})
        else {
            chatHistory = res.chatHistory
            pinnedComment = res.pinnedComment

            // Perform modification
            chatHistory.remove(comment)
            pinnedComment.push(comment)

            // Sort both arrays
            const sortedChatHistory = chatHistory.sort((a,b) => b.chatAt - a.chatAt)
            const sortedPinnedComment = pinnedComment.sort((a,b) => b.chatAt - a.chatAt)

            // Update to the database 
            Event.findOneAndUpdate({eventID:eventID}, {$set:{
                chatHistory: sortedChatHistory,
                pinnedComment: sortedPinnedComment
            }}, function (err ,result){ 
                if (err) response.status(400).send({message:"Error Occured "+ err})
                else response.status(200).send({message: "The comment has been pinned!", response: result})
            })
        }
    })

})


router.post('/event/unpin/:eventID',[authJwt.verifyToken], function (req, response){
                    /*
      This function is used to unpin a comment 
      Requirements (params): include the event's id as eventID in the params
      Requirements (Body): include the comment as comment in the body
    */

    const eventID = req.params.eventID
    const comment = req.body.comment 

    Event.findOne({eventID:eventID}).exec(function (err, res){
        if (err) response.status(400).send({message: "Error Occured: "+ err})
        else {
            chatHistory = res.chatHistory
            pinnedComment = res.pinnedComment

            // Perform Modification 
            chatHistory.push(comment)
            pinnedComment.remove(comment)

            // Sort both arrays
            const sortedChatHistory = chatHistory.sort((a,b) => b.chatAt - a.chatAt)
            const sortedPinnedComment = pinnedComment.sort((a,b) => b.chatAt - a.chatAt)

            // Update the database
            Event.findOneAndUpdate({eventID:eventID}, {$set:{
                chatHistory: sortedChatHistory,
                pinnedComment: sortedPinnedComment
            }}, function (err, result){
                if(err) response.status(400).send({message: "Error Occured: "+ err})
                else response.status(200).send({message: "The comment has been unpinned!", response: result})
            })
        }
    })
})

module.exports = router;