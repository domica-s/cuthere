var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var params = require("./params/params");

var setuppassport = require("./setuppassport");

var app = express();
mongoose.connect(params.DATABASECONNECTION);
setuppassport();

app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret: "fqwh89ry18912490h10fc2cf12",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/", require("./routes"));

// create events
app.post("/create", function(req,res){
    // Need testing

    // Searches for the Event database to find the latest tag
    var latest_tag = Event.find().sort({tags: -1}).limit(1); 

    latest_tag.exec(function(err, event_tag){
        if(err) res.send("The error is " + err); 
        else {
            
            var tag = 1;
            if (event_tag.length > 0) tag = event_tag[0].event_tag + 1; 

            var event = new Event({
                title: req.body["name"],
                tags: tag, 
                venue: req.body["loc"],
                date: req.body["eDate"],
                numberOfParticipants: req.body["quota"], 
                activityCategory: req.body["category"],
                createdAt: req.body["createdOn"]
            });

            event.save(function (err) {
                if (err) res.send("The error is: " + err);
                else {
                    res.status(201); // send status
                    res.send("Event with tag "+ tag +" been created!")
        
                }
            });

        }
    })

})



// post Event form
app.get("/postevent", function (req, res) {
	res.sendFile(__dirname + "/eventForm.html");
});

app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
});

