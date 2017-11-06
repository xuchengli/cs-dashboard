const express = require("express");
const co = require("co");
const config = require("../modules/configuration");
const AIVision = require("../modules/ai-vision");

const router = express.Router();
router.get("/webapis", (req, res) => {
    co(function* () {
        let av = new AIVision();
        let userInfo = JSON.parse(req.cookies[config.cookieName]);
        let apis = yield av.getWebAPIs(userInfo.token);
        res.json(apis);
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
module.exports = router;
