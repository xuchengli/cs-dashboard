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
    }
});
const upload = multer({ storage: storage }).single("video");
router.post("/upload", upload, (req, res) => {
    co(function* () {
        let video = new Video();
        let originalname = req.file.originalname;
        let destination = req.file.destination;
        let filename = req.file.filename;
        let cover = originalname.substring(0, originalname.lastIndexOf(".")) + ".png";

        let input = path.join(destination, filename);
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
        res.sendStatus(500);
    });
});
router.post("/stream", (req, res) => {
    co(function* () {
        let video = new Video();
        let file = {};
        let fileurl = req.body.url;
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
        let slice = yield video.screenShot(fileurl, output, 1);
        if (slice) {
            Object.assign(file, { cover: cover });
        }
        let userInfo = JSON.parse(req.cookies[config.cookieName]);
        let saved = yield video.save(userInfo.apikey, file);
        res.json(saved);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
router.get("/:id/cover", (req, res) => {
    co(function* () {
        let video = new Video();
        let file = yield video.findById(req.params.id);
        res.sendFile(file.cover, { root: file.destination });
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
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
        res.sendStatus(500);
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
        res.sendStatus(500);
    });
});
router.get("/:id", (req, res) => {
    co(function* () {
        let video = new Video();
        let file = yield video.findById(req.params.id);
        if (file) {
            let fileurl = file.originalname;
            if (file.source_type === "file") {
                fileurl = req.protocol + "://" + req.get("host") +
                        config.Context_Path + "/api/video/" + req.params.id;
            }
            /**
             * 调用获取websocket视频流的API
            **/
            let videoStream = yield video.getStream(fileurl, "");
            if (videoStream.success) {
                res.json(Object.assign(file, {
                    stream_id: videoStream.stream_id,
                    stream_address: videoStream.stream_address,
                    stream_api: videoStream.stream_api
                }));
            } else {
                res.sendStatus(503);
            }
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
router.post("/bind/:api", (req, res) => {
    co(function* () {
        let video = new Video();
        let binded = yield video.bindAPI(req.body.url, req.params.api);
        res.json(binded);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
router.post("/unbind/:api", (req, res) => {
    co(function* () {
        let video = new Video();
        let unbinded = yield video.unbindAPI(req.body.url, req.params.api);
        res.json(unbinded);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
module.exports = router;
