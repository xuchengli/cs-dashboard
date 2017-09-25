const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: { type: String, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

class user {
    isExist(userId) {
        return new Promise((resolve, reject) => {
            User.count({ user_id: userId }, (err, count) => {
                if (err) reject(err);
                resolve(count > 0);
            });
        });
    }
    register(userId, password) {
        return new Promise((resolve, reject) => {
            let user = new User({
                user_id: userId,
                password: password
            });
            user.save((err, userInfo) => {
                if (err) reject(err);
                resolve({ user_id: userInfo.user_id });
            });
        });
    }
}
module.exports = user;
