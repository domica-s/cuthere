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
const Grid = require('gridfs-stream');
const upload = require("./routes/upload");
let gfs, gridfsBucket;

var setuppassport = require("./setuppassport");
const e = require("connect-flash");

var app = express();
mongoose.connect(params.DATABASECONNECTION,{
    useUnifiedTopology: true, 
    useNewUrlParser: true
},() => console.log("Connected to MongoDB"));

const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'photos'
  });
 
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('photos');
})

app.use("/file", upload);

app.get('/file/:filename', async (req, res) => {
    try{
        gridfsBucket.find({filename: req.params.filename}).toArray((err, files) => {
            if (!files[0] || files.length === 0){
                return res.status(400).send("No such file");
            }
            if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png') {
                gridfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
            }
            else {
                res.status(401).send({message: "Not an image"});
            }
        })
    }catch(err){
        console.log(err);
        res.status(404).send('not found');
    }
})

app.get('/file/delete/:filename', async (req, res) => {
    try {
        gridfsBucket.find({filename: req.params.filename}).toArray((err, files) => {
            if (!files[0] || files.length === 0){
                return res.status(400).send("No such file");
            }
            gridfsBucket.delete(files[0]._id)
            .then((err, data) => {
                if (err) {
                    return res.status(400).send({message: err});
                }
                res.status(200).send({messaeg: "File: " + req.params.filename + " is deleted"});
            })       
        })
    } catch (error) {
        console.log(error);
        res.status(404).send('not found')
    }
})

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
//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

require('./routes/auth.routes')(app);
require('./routes/admin.routes')(app);
app.use("/", require("./routes"));

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
});


