const express = require("express");
const co = require("co");
const config = require("../modules/configuration");
const AIVision = require("../modules/ai-vision");

const router = express.Router();
router.get("/webapis", (req, res) => {
    co(function* () {
        let av = new AIVision();
        let userInfo = JSON.parse(req.cookies[config.cookieName]);
        let apis = yield av.getWebAPIs(req.cookies[config.tokenCookie]);
        if (apis.fault) {
            let tokens = yield av.getToken(userInfo.username);
            if (tokens.token) {
                res.cookie(config.tokenCookie, tokens.token);
                apis = yield av.getWebAPIs(tokens.token);
            }
        }
        res.json(apis);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});
module.exports = router;
