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
        let pluginId = req.body.pluginId;
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
        //创建视频流
        let videoSrc = req.protocol + "://" + req.get("host") +
                    config.Context_Path + "/api/video/" + saved._id;
        let videoStream = yield video.createStream(videoSrc, pluginId);
        let integratedVideo = yield video.setStream(saved._id, videoStream);
        res.json(integratedVideo);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
router.post("/stream", (req, res) => {
    co(function* () {
        let video = new Video();
        let file = {};
        let fileUrl = req.body.url;
        let pluginId = req.body.pluginId;
        let fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        let cover = (fileName.substring(0, fileName.lastIndexOf(".")) || fileName) + ".png";
        let destination = path.join(uploadDir, dateFormat(new Date(), "yyyymmddHHMMss.l"));
        fs.ensureDirSync(destination);

        Object.assign(file, {
            source_type: "stream",
            originalname: fileUrl,
            destination: destination,
            filename: fileName
        });
        let output = path.join(destination, cover);
        let slice = yield video.screenShot(fileUrl, output, 1);
        if (slice) {
            Object.assign(file, { cover: cover });
        }
        let userInfo = JSON.parse(req.cookies[config.cookieName]);
        let saved = yield video.save(userInfo.apikey, file);
        //创建视频流
        let videoStream = yield video.createStream(fileUrl,pluginId);
        let integratedVideo = yield video.setStream(saved._id, videoStream);
        res.json(integratedVideo);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

router.get("/plugins",(req, res) => {
    co(function* () {
        let video = new Video();
        let response = yield video.listPlugins();
        res.json(response);
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
        //删除视频流
        yield video.deleteStream(file.stream_id);
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
            res.json(file);
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
router.post("/bind", (req, res) => {
    co(function* () {
        let video = new Video();
        let binded = yield video.bindAPI(req.body.url, req.body.api);
        res.json(binded);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
router.delete("/unbind/:id", (req, res) => {
    co(function* () {
        let video = new Video();
        let unbinded = yield video.unbindAPI(req.body.url, req.params.id);
        res.json(unbinded);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
router.post("/apis", (req, res) => {
    co(function* () {
        let video = new Video();
        let apis = yield video.listAPIs(req.body.url);
        res.json(apis.apis);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
router.post("/record/:switch", (req, res) => {
    co(function* () {
        let video = new Video();
        let record_video = {};
        if (req.params.switch === "start") {
            record_video = yield video.startRecord(req.body.url);
        } else if (req.params.switch === "stop") {
            record_video = yield video.stopRecord(req.body.url, req.body.seconds);
        }
        res.json(record_video);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
router.post("/addPoint", (req, res) => {
    co(function* () {
        let video = new Video();
        let response = yield video.addPoint(req.body.url, req.body.point);
        res.json(response);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
module.exports = router;
