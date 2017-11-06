const express = require("express");
const co = require("co");
const config = require("../modules/configuration");
const User = require("../modules/user");
const Video = require("../modules/video");
const AIVision = require("../modules/ai-vision");

const router = express.Router();
router.post("/register", (req, res) => {
    co(function* () {
        let userId = req.body.userId;
        let password = req.body.password;
        let user = new User();
        let registration = yield user.register(userId, password);
        if (registration.success) {
            let av = new AIVision();
            let apikey = registration.apikey;
            let account = yield user.account(apikey);
            let tokens = yield av.getToken(account.username);
            if (tokens.token) {
                Object.assign(account, { token: tokens.token });
            }
            res.cookie(config.cookieName, JSON.stringify(account));
            res.json(account);
        } else if (registration.code === 2001) {
            res.sendStatus(409);
        } else {
            throw new Error(registration.description);
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
router.post("/login", (req, res) => {
    co(function* () {
        let userId = req.body.userId;
        let password = req.body.password;
        let rememberme = req.body.rememberme;
        let user = new User();
        let validation = yield user.validate(userId, password);
        if (validation.success) {
            let av = new AIVision();
            let apikey = validation.description;
            let account = yield user.account(apikey);
            let tokens = yield av.getToken(account.username);
            if (tokens.token) {
                Object.assign(account, { token: tokens.token });
            }
            if (rememberme) {
                res.cookie(config.cookieName, JSON.stringify(account), {
                    maxAge: 365 * 24 * 60 * 60 * 1000
                });
            } else {
                res.cookie(config.cookieName, JSON.stringify(account));
            }
            res.json(account);
        } else if (validation.code === 2003) {
            res.sendStatus(403);
        } else {
            throw new Error(validation.description);
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
router.get("/video/:id", (req, res) => {
    co(function* () {
        let video = new Video();
        let file = yield video.findById(req.params.id);
        res.sendFile(file.filename, { root: file.destination });
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
module.exports = router;
