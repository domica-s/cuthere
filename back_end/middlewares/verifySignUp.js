const User = require("../models/user");

checkDuplicateSID = (req, res, next) => {
    // SID
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