const express = require("express");
const co = require("co");
const User = require("../modules/user");

const router = express.Router();
router.post("/register", (req, res) => {
    co(function* () {
        let userId = req.body.userId;
        let password = req.body.password;
        let user = new User();
        let isExist = yield user.isExist(userId);
        if (isExist) {
            res.sendStatus(409);
        } else {
            let userInfo = yield user.register(userId, password);
            res.json(userInfo);
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});
module.exports = router;
