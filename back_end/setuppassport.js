var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./models/user");

module.exports = function () {
    //turns a user object into an id
    passport.serializeUser(function (user, done) {
        //serializing the user
        done(null, user._id);
    });
    //turns the id into a user object
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use("login", new LocalStrategy({
        usernameField: 'sid',
        passwordField: 'password'
    }, function (sid, password, done) {
        User.findOne({ sid: sid }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: "That SID is not yet registered" });
            }
            user.checkPassword(password, function (err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Invalid password" });
                }
            });
        });
    }));



}