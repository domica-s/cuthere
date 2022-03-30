var express = require("express");
var User = require("../models/user");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
var router = express.Router();

// /user/:sid
router.get("/:sid", [authJwt.verifyToken], controller.getUserProfile);
router.post("/:sid/comment", [authJwt.verifyToken], controller.leaveUserRating);
router.post("/:sid/comment/update", [authJwt.verifyToken], controller.updateUserRating);

module.exports = router;