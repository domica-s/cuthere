var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var router = express.Router();

router.get("/", (req, res) =>
    res.render("home/index"));
 
router.get("/home", (req,res) =>
    res.render("home/home"));

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/home");
});

router.get("/login", (req,res) =>
    res.render("home/login"));

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/signup", (req,res) =>
    res.render("home/signup"));

router.post("/signup", function (req, res, next) {
    var username = req.body.username;
    var sid = req.body.sid;
    var password = req.body.password;

    User.findOne({ sid: sid }, function (err, user) {
        if (err) { return next(err); }
        if (user) {
            req.flash("error", "There's already an account with this sid");
            return res.redirect("/signup");
        }

        var newUser = new User({
            username: username,
            password: password,
            sid: sid
        });

        newUser.save(next);

    });

}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));

module.exports = router;