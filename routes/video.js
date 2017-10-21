const express = require("express");
const co = require("co");
const path = require("path");
const multer = require("multer");
const dateFormat = require("dateformat");
const mkdirp = require("mkdirp");
const config = require("../modules/configuration");
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
        let userInfo = JSON.parse(req.cookies[config.cookieName]);
        let saved = yield video.save(userInfo.apikey, req.file);
        res.json(saved);
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
router.get("/:id/cover", (req, res) => {
    co(function* () {
        let video = new Video();
        let file = yield video.findById(req.params.id);
        res.sendFile(file.cover, { root: file.destination });
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
router.get("/list", (req, res) => {
    co(function* () {
        let video = new Video();
        let userInfo = JSON.parse(req.cookies[config.cookieName]);
        let videos = yield video.list(userInfo.apikey);
        res.json(videos);
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
module.exports = router;
