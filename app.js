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

app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
});

//test