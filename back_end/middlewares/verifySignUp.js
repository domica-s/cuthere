// The codes are used for middlewares for Signing Up
// PROGRAMMER: Domica
// Revised on 5/5/2022

const User = require("../models/user");

checkDuplicateSID = (req, res, next) => {
                    /*
      This function is used to check if there are duplicate SIDs
      Requirements (body): pass sid as sid in the body 
      */
    User.findOne({
        sid: req.body.sid
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "Failed! SID is already in use!" });
            return;
        }
        next();
    });
};

checkDuplicateUsername = (req, res, next) => {
                        /*
      This function is used to check if there are duplicate username 
      Requirements (body): pass the username as username in the body
      */
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }
        next();
    });
};

const verifySignUp = { checkDuplicateSID, checkDuplicateUsername };
module.exports = verifySignUp;