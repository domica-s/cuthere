var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var Event = require("../models/event");
const res = require("express/lib/response");
var router = express.Router();


router.get("/", (req, res) =>
    res.render("home/index"));
 
router.get("/home", (req,res) =>
    res.render("home/home"));

router.get("/event", (req, res) =>
    res.render("event/event"));

module.exports = router;