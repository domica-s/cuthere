var express = require("express");
var mongoose = require("mongoose");

var Event = require("../models/event");
var User = require("../models/user");
const controller = require("../controllers/user.controller");
var router = express.Router();

const res = require("express/lib/response");

const { authJwt } = require("../middlewares");
const { update } = require("../models/event");
const { DATABASECONNECTION } = require("../params/params");

router.post("/feed", [authJwt.verifyToken], controller.getFeeds);

module.exports = router;