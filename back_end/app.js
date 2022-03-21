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
const e = require("connect-flash");

var app = express();
mongoose.connect(params.DATABASECONNECTION,{
    useUnifiedTopology: true, 
    useNewUrlParser: true
},() => console.log("Connected to MongoDB"));

setuppassport();

app.set("port", process.env.PORT || 8080);
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

// To use the Calendar
app.use("/api/calendar", require("./routes/calendar"));
app.use("/", require("./routes"));

//CORS Problem
var cors = require('cors');
app.use(cors());

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
});

