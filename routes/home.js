var express = require("express");

var router = express.Router();


router.get("/", function(req, res) {
    res.render("home/");
});
 
router.get("/home", function(req,res){
    res.render("home/home");
});

module.exports = router;