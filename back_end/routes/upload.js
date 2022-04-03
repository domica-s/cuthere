const upload = require('../middlewares/upload');
const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
var mongoose = require("mongoose");

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'photos'
  });
 
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('photos');
});


// upload using POST http://{server}/file/upload
router.post("/upload", upload.single("file"), (req, res) => {
    if (req.file === undefined) {
        return res.status(400).send("There is no file uploaded");
    }
    const imgUrl = '/file/' + req.file.filename;
    return res.status(200).send(imgUrl);
})

// view file using GET http://{server}/file/:filename
router.get('/:filename', async (req, res) => {
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

router.get('/delete/:filename', async (req, res) => {
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

module.exports = router;