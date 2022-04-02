const upload = require('../middlewares/upload');
const express = require('express');
const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
    if (req.file === undefined) {
        return res.status(400).send("There is no file uploaded");
    }
    const imgUrl = '/file/' + req.file.filename;
    return res.status(200).send(imgUrl);
})


module.exports = router;