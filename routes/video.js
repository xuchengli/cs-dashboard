const express = require("express");
const co = require("co");
const path = require("path");
const multer = require("multer");
const dateFormat = require("dateformat");
const mkdirp = require("mkdirp");
const Video = require("../modules/video");

const router = express.Router();
const uploadDir = path.join(__dirname, "../", "upload");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let datetime = dateFormat(new Date(), "yyyymmddHHMMss.l");
        let videoUploadDir = path.join(uploadDir, datetime);
        mkdirp.sync(videoUploadDir);
        cb(null, videoUploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage }).single("video");
router.post("/upload", upload, (req, res) => {
    co(function* () {
        let video = new Video();
        let destination = req.file.destination;
        let filename = req.file.filename;
        let cover = filename.substring(0, filename.lastIndexOf(".")) + ".png";

        let input = path.join(destination, filename);
        let output = path.join(destination, cover);
        let slice = yield video.timeSlice(input, output, 0);
        if (slice) {
            Object.assign(req.file, { cover: cover });
        }
        let saved = yield video.save(req.file);
        res.json(saved);
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
module.exports = router;
