var express = require("express");
var Event = require("../models/event");
const res = require("express/lib/response");
var router = express.Router();

var ensureAuthenticated = require("../auth/auth").ensureAuthenticated;

router.get("/event_lists", ensureAuthenticated, function (req, res) {

    var event_dic = {}

    Event.find(function (err, event) {
        if (event.length > 0){
            for (var i = 0; i < event.length; i++) {
                event_dic[i] = event[i]
            }
            res.send(event_dic)
        }
    })
})


module.exports = router;