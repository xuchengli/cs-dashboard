const express = require("express");
const co = require("co");
const config = require("../modules/configuration");
const User = require("../modules/user");

const router = express.Router();
router.post("/register", (req, res) => {
    co(function* () {
        let userId = req.body.userId;
        let password = req.body.password;
        let user = new User();
        let registration = yield user.register(userId, password);
        if (registration.success) {
            let apikey = registration.apikey;
            let account = yield user.account(apikey);
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
            let apikey = validation.description;
            let account = yield user.account(apikey);
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
module.exports = router;
