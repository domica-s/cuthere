var express = require("express");
var mongoose = require("mongoose");

var Event = require("../models/event");
var User = require("../models/user");

var router = express.Router();

const res = require("express/lib/response");

const { authJwt } = require("../middlewares");
const { update } = require("../models/event");

// STATUS --> WORKING
function checkRegistered(user_id, participants){
    const stringParticipants = participants.map( x => x.toString()) 

    if (stringParticipants.includes(user_id)) return true
    else return false

}

// Register Events --> WORKING
router.post('/event/register/:eventID', [authJwt.verifyToken], function (req, res){

    // Acquire parameters
    const eventID = req.params.eventID
    const userID = req.body.id // This is an ObjectID
    console.log(req.body)

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
                    else {console.log("Updated The Database Nigga!")} // Please change this
                })
            }
        }
        else res.status(200).send("You have already registered for this event!")
    })

})

// Unregister Events --> WORKING
router.post('/event/unregister/:eventID', [authJwt.verifyToken], function (req, res){

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
                    else {console.log("Removed this nigga from the database!")} // Please change this
                })
            
        }
        else res.status(200).send({message:"You are not registered for this event"})
    })

})
// Update the event --> TESTING
router.post('/event/update/:eventID', [authJwt.verifyToken], function(req,res){
    
    //Acquire Parameters
    const eventID = req.params.eventID 
    const userID = req.body.id
    const updateParam = req.body.updateParam // This parameter should give something like {status:"Closed"}

    Event.findOne({eventID: eventID}).exec(function(err, result){
        if(err) res.status(400).send({message:"Error Occured: " + err})

        else if (result.createdBy != userID ) res.status(200).send({message: "You have no authority to update this event"})
        
        else { 
            Event.findOneAndUpdate({eventID:eventID}, $set(updateParam)).exec(function(err, result){
                if(err) res.status(400).send({message:"Error occured: "+ err})
                else res.status(200).send({message:"The database is updated nigga! "}) // Please change this
            })
        }
    })
})


// Delete Events --> WORKING
router.post('/event/delete/:eventID',[authJwt.verifyToken], function(req,res){
    // Acquire Parameters
    const eventID = req.params.eventID
    const userID = req.body.id

    Event.findOne({eventID:eventID}).exec(function(err, result){
        if(err) res.status(400).send({message:"Error Occured: "+ err})

        else if (result.createdBy != userID) res.status(200).send({message: "You have no authority to delete this event!"})

        else Event.findOneAndDelete({eventID:eventID}).exec(function (err, result){
            if(err) return res.status(400).send({message: "Error Occured: "+ err})
            else if (result === null) return res.status(200).send({message:"There are no such events"})
            else {return res.status(200).send({message:"Event is deleted!", status: 'SUCCESS'})} 
        })
    })
})

// Add comments to Events --> WORKING
router.post('/event/addcomment/:eventID', [authJwt.verifyToken], function (req,res){
    const eventID = req.params.eventID 
    const comment = req.body.comment

    Event.findOne({eventID: eventID}).exec(function(err,result){
        if(err) res.status(200).send({message: "Error occured: "+ err})

        else {
            const chatHistory = [...result.chatHistory,comment]
            // Update the dB
            Event.findOneAndUpdate({eventID: eventID}, {$set: {chatHistory: chatHistory}}).exec(function(err, result){
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

module.exports = router;