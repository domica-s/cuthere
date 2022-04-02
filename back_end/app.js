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
var crypto = require("crypto");
// temp
const multer = require('multer')
// temp

var setuppassport = require("./setuppassport");
const e = require("connect-flash");

var app = express();
mongoose.connect(params.DATABASECONNECTION,{
    useUnifiedTopology: true, 
    useNewUrlParser: true
},() => console.log("Connected to MongoDB"));

setuppassport();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

// temp
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        var fileName = crypto.randomBytes(10).toString('hex');
        file.filename = fileName;
        cb(null, fileName + '.jpg');
    },
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024*1024*2 }
});
// end tmep

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------
// temp
app.post('/image', upload.single('file'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.status(404).send({
            success: false
    });

    } else {
        console.log('file received');
        return res.status(200).send({
            success: true
        })
    }
});
// end temp
require('./routes/auth.routes')(app);
require('./routes/admin.routes')(app);
app.use("/", require("./routes"));

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
});


