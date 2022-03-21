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

const verifySignUp = { checkDuplicateSID };
module.exports = verifySignUp;