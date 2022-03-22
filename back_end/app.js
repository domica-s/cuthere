var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var params = require("./params/params");
var cors = require("cors");


var setuppassport = require("./setuppassport");
const e = require("connect-flash");

var app = express();
mongoose.connect(params.DATABASECONNECTION,{
    useUnifiedTopology: true, 
    useNewUrlParser: true
},() => console.log("Connected to MongoDB"));

setuppassport();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
      origin: "http://localhost:3000", // <-- location of the react app were connecting to
      credentials: true,
    })
);

app.use(session({
    secret: "fqwh89ry18912490h10fc2cf12",
    resave:false,
    saveUninitialized:false
}));
app.use(cookieParser("fqwh89ry18912490h10fc2cf12"));

setuppassport();

app.set("port", process.env.PORT || 8080);
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
app.use("/api/calendar", require("./routes/calendar"));
app.use("/", require("./routes"));

// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to bezkoder application." });
//   });

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
});


