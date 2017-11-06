const axios = require("axios");
const config = require("./configuration");

class aivision {
    getToken(userId) {
        return new Promise((resolve, reject) => {
            axios.post("/tokens", {
                usr_id: config.AI_VISION.admin.id,
                pwd: config.AI_VISION.admin.password,
                op_usr_id: userId
            }, {
                baseURL: config.AI_VISION.api
            }).then(res => resolve(res.data)).catch(err => reject(err));
        });
    }
    getWebAPIs(token) {
        return new Promise((resolve, reject) => {
            axios("/webapis", {
                baseURL: config.AI_VISION.api,
                headers: { "X-Auth-Token": token }
            }).then(res => resolve(res.data)).catch(err => reject(err));
        });
    }
}
module.exports = aivision;
