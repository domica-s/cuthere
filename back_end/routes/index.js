var express = require("express");
const { route } = require("./home");

var router = express.Router();

router.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    
    next();
});


router.use("/", require("./home"));
router.use("/", require("./event"));
router.use("/", require("./calendar"));
router.use("/event/all", require("./event"));
router.use("/user/", require("./user"));

module.exports = router;