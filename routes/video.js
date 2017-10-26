const express = require("express");
const co = require("co");
const path = require("path");
const multer = require("multer");
const dateFormat = require("dateformat");
const fs = require("fs-extra");
const config = require("../modules/configuration");
const Video = require("../modules/video");

const router = express.Router();
const uploadDir = path.join(__dirname, "../", "upload");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let datetime = dateFormat(new Date(), "yyyymmddHHMMss.l");
        let videoUploadDir = path.join(uploadDir, datetime);
        fs.ensureDirSync(videoUploadDir);
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

        let input = path.join(destination, filename);
        let probe = yield video.probe(input);
        if (probe) {
            Object.assign(req.file, probe);
        }
        let cover = filename.substring(0, filename.lastIndexOf(".")) + ".png";
        let output = path.join(destination, cover);
        let slice = yield video.screenShot(input, output, 1);
        if (slice) {
            Object.assign(req.file, { cover: cover });
        }
        Object.assign(req.file, { source_type: "file" });
        let userInfo = JSON.parse(req.cookies[config.cookieName]);
        let saved = yield video.save(userInfo.apikey, req.file);
        res.json(saved);
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
router.post("/stream", (req, res) => {
    co(function* () {
        let video = new Video();
        let file = {};
        let probe = yield video.probe(req.body.url);
        if (probe) {
            Object.assign(file, probe);
        }
        let fileurl = file.fileurl;
        let filename = fileurl.substring(fileurl.lastIndexOf("/") + 1);
        let cover = (filename.substring(0, filename.lastIndexOf(".")) || filename) + ".png";
        let destination = path.join(uploadDir, dateFormat(new Date(), "yyyymmddHHMMss.l"));
        fs.ensureDirSync(destination);

        Object.assign(file, {
            source_type: "stream",
            originalname: fileurl,
            destination: destination,
            filename: filename
        });
        let output = path.join(destination, cover);
        let slice = yield video.screenShot(req.body.url, output, 1);
        if (slice) {
            Object.assign(file, { cover: cover });
        }
        let userInfo = JSON.parse(req.cookies[config.cookieName]);
        let saved = yield video.save(userInfo.apikey, file);
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
router.delete("/:id", (req, res) => {
    co(function* () {
        let video = new Video();
        let file = yield video.remove(req.params.id);
        fs.removeSync(file.destination);
        res.json(file);
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
router.get("/:id", (req, res) => {
    co(function* () {
        let video = new Video();
        let file = yield video.findById(req.params.id);
        res.json(file);
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
module.exports = router;
