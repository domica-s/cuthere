var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var Event = require("../models/event");
const res = require("express/lib/response");
var router = express.Router();

var ensureAuthenticated = require("../auth/auth").ensureAuthenticated;

router.get("/", (req, res) =>
    res.render("home/index"));
 
router.get("/home", (req,res) =>
    res.render("home/home"));

router.get("/event", ensureAuthenticated, (req, res) =>
    res.render("event/event"));

router.post("/testfront", (req, res) => console.log('someone clicked test connection'));

module.exports = router;