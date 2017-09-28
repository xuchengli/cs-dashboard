const express = require("express");
const co = require("co");
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
module.exports = router;
