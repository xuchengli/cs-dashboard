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
            res.json({
                success: false,
                code: 0,
                message: "User ID is exist."
            });
        } else {
            let userInfo = yield user.register(userId, password);
            let resp = { success: true };
            res.json(Object.assign(resp, userInfo));
        }
    }).catch(err => {
        let resp = { success: false };
        res.json(Object.assign(resp, err));
    });
});
module.exports = router;
