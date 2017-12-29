const express = require("express");
const co = require("co");
const config = require("../modules/configuration");
const AIVision = require("../modules/ai-vision");
const Video = require("../modules/video");

const router = express.Router();
router.post("/webapis", (req, res) => {
    co(function* () {
        let av = new AIVision();
        let video = new Video();
        let userInfo = JSON.parse(req.cookies[config.cookieName]);
        let av_apis = yield av.getWebAPIs(req.cookies[config.tokenCookie]);
        if (av_apis.fault) {
            let tokens = yield av.getToken(userInfo.username);
            if (tokens.token) {
                res.cookie(config.tokenCookie, tokens.token);
                av_apis = yield av.getWebAPIs(tokens.token);
            }
        }
        let video_apis = yield video.listAPIs(req.body.url);
        res.json({
            "AIVision": av_apis,
            "video": video_apis.apis
        });
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
module.exports = router;
