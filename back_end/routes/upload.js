// The code is the routes for implementation / functionalities related to uploading a file image
// PROGRAMMER: Ethan
// Revised on 5/5/2022

const upload = require('../middlewares/upload');
const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
var mongoose = require("mongoose");
const { authJwt } = require("../middlewares");

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
router.post("/upload", [authJwt.verifyToken], upload.single("file"), (req, res) => {
                          /*
      This function is used to upload a file
      Requirements(file): Include the file in the request
    */

    if (req.file === undefined) {
        return res.status(400).send({message: "There is no file uploaded"});
    }
    return res.status(200).send({message: "Successfully uploaded the image!"});
})

// view file using GET http://{server}/file/:filename
router.get('/:filename', [authJwt.verifyToken], async (req, res) => {
                          /*
      This function is used to view a specific file
      Requirements (params): Include the filename as filename in the params
    */

    try{
        gridfsBucket.find({filename: req.params.filename}).toArray((err, files) => {
            if (!files[0] || files.length === 0){
                return res.status(400).send({message: "No such file"});
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
        res.status(404).send({message: 'not found'});
    }
})

router.get('/delete/:filename', [authJwt.verifyToken], async (req, res) => {
                          /*
      This function is used to delete a certain file
      Requirements (params): Include the filename as filename in the params
    */

    try {
        gridfsBucket.find({filename: req.params.filename}).toArray((err, files) => {
            if (!files[0] || files.length === 0){
                return res.status(400).send({message: "No such file"});
            }
            gridfsBucket.delete(files[0]._id)
            .then((err, data) => {
                if (err) {
                    return res.status(400).send({message: err});
                }
                res.status(200).send({message: "File: " + req.params.filename + " is deleted"});
            })       
        })
    } catch (error) {
        console.log(error);
        return res.status(404).send({message: 'not found'})
    }
})

router.get('/all/delete', [authJwt.verifyToken], async (req, res) => {
                          /*
      This function is used to delete all files
    */
   
    try {
        gridfsBucket.find({}).toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(400).send({message: "There are no files"});
            }
            for (i = 0; i < files.length; i++) {
                gridfsBucket.delete(files[i]._id)
                .then((err, data) => {
                    if (err) {
                        return res.status(400).send({message: err});
                    }
                })
            }
            return res.status(200).send({message: "All files deleted"});
        })
    } catch (error) {
        console.log(err);
        return res.status(404).send({message: 'error: ' + err});
    }
})

module.exports = router;