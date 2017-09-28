const axios = require("axios");
const https = require("https");
const uuid = require("uuid/v1");
const config = require("./configuration");
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

class user {
    account(apikey) {
        return new Promise((resolve, reject) => {
            axios("user/account/apikey/" + apikey, {
                baseURL: config.SV_BaseURL,
                httpsAgent: httpsAgent
            }).then(res => resolve(res.data)).catch(err => reject(err));
        });
    }
    register(userId, password) {
        return new Promise((resolve, reject) => {
            let apikey = uuid();
            axios.post("user/account", {
                username: userId,
                passwd: password,
                apikey: apikey
            }, {
                baseURL: config.SV_BaseURL,
                httpsAgent: httpsAgent
            }).then(res => {
                resolve(Object.assign(res.data, {
                    apikey: apikey
                }));
            }).catch(err => reject(err));
        });
    }
}
module.exports = user;
