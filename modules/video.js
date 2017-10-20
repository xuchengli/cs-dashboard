const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    originalname: String,
    mimetype: String,
    destination: String,
    filename: String,
    cover: String,
    size: Number,
    width: Number,
    height: Number,
    duration: Number,
    frames: Number,
    framerate: String,
    timeslice: [{
        no: Number,
        timepoint: String,
        filename: String
    }]
}, { bufferCommands: false });
const Video = mongoose.model("Video", videoSchema);

class video {
    save(file) {
        return new Promise((resolve, reject) => {
            let video = new Video({
                originalname: file.originalname,
                mimetype: file.mimetype,
                destination: file.destination,
                filename: file.filename,
                size: file.size
            });
            video.save((err, video) => {
                if (err) reject(err);
                resolve(video);
            });
        });
    }
}
module.exports = video;
