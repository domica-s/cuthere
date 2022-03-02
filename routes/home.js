var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var Event = require("../models/event")
var router = express.Router();

var ensureAuthenticated = require("../auth/auth").ensureAuthenticated;

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
            req.flash("error", "There's already an account with this SID");
            return res.redirect("/signup");
        }

        var newUser = new User({
            username: username,
            password: password,
            sid: sid,
            email:sid + "@link.cuhk.edu.hk",
            mobileNumber:0,
            // profilePicture:"",
            interests:"",
            college:"",
            about:"",
            rating:"",
            friends:"",
        });

        newUser.save(next);

    });

}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.get("/event", ensureAuthenticated, (req, res) =>
    res.render("home/event"));

router.post("/event", function (req, res, next) {
    var title =  req.body.title
    var tags = req.body.tags
    var location = req.body.location
    var date = req.body.date
    var quota = req.body.quota
    var category = req.body.category
    var history = req.body.history
    var createdOn = req.body.createdOn

    var newEvent = new Event({
        title: title,
        tags: tags,
        venue: location,
        date: date,
        numberOfParticipants: quota,
        activityCategory: category,
        chatHistory: history,
        createdAt: createdOn,
    });
    newEvent.save(next)
    console.log(title, tags, location)
    res.redirect('/')
});

module.exports = router;