var express = require("express");

var router = express.Router();

router.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    
    next();
});

//router.use("/", require("./feeds"));
router.use("/", require("./event"));
router.use("/", require("./eventDetails"))
router.use("/api/calendar", require("./calendar"));
router.use("/user/", require("./user.routes"));

module.exports = router;