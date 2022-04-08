var express = require("express");
var User = require("../models/user");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
var router = express.Router();

// /user/:sid
router.get("/:sid", [authJwt.verifyToken], controller.getUserProfile);
router.post("/:sid/comment", [authJwt.verifyToken], controller.leaveUserRating);
router.post("/follow/:sid", [authJwt.verifyToken], controller.followUser);
router.post("/unfollow/:sid", [authJwt.verifyToken], controller.unfollowUser);
router.post("/recommendfriends/college", [authJwt.verifyToken], controller.recommendedFriendsCollege);
router.post("/recommendfriends/interests", [authJwt.verifyToken], controller.recommendedFriendsInterests);

module.exports = router;