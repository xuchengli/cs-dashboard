const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    apikey: { type: String, required: true },
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
    }],
    timestamp: { type: Date, default: Date.now }
}, { bufferCommands: false });
const Video = mongoose.model("Video", videoSchema);

class video {
    timeSlice(input, output, time) {
        return new Promise((resolve, reject) => {
            ffmpeg(input).seekInput(time).output(output).noAudio().frames(1).on("end", () => {
                resolve(true);
            }).on("error", err => {
                reject(err);
            }).run();
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            Video.findById(id, (err, video) => {
                if (err) reject(err);
                resolve(video);
            });
        });
    }
    save(apikey, file) {
        return new Promise((resolve, reject) => {
            let video = new Video({
                apikey: apikey,
                originalname: file.originalname,
                mimetype: file.mimetype,
                destination: file.destination,
                filename: file.filename,
                cover: file.cover,
                size: file.size
            });
            video.save((err, video) => {
                if (err) reject(err);
                resolve(video);
            });
        });
    }
    list(apikey) {
        return new Promise((resolve, reject) => {
            Video.find(
                { apikey: apikey },
                "-timeslice -__v",
                { sort: "-timestamp" },
                (err, videos) => {
                    if (err) reject(err);
                    resolve(videos);
                }
            );
        });
    }
}
module.exports = video;
