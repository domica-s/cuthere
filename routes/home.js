var express = require("express");

var router = express.Router();

router.get("/", (req, res) =>
    res.render("home/index"));
 
router.get("/home", (req,res) =>
    res.render("home/home"));

router.get("/login", (req,res) =>
    res.render("home/login"));

router.get("/signup", (req,res) =>
    res.render("home/signup"));

module.exports = router;