const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    apikey: { type: String, required: true },
    originalname: String,
    destination: String,
    filename: String,
    cover: String,
    width: Number,
    height: Number,
    duration: Number,
    frame_rate: Number,
    timeslice: [{
        no: Number,
        timepoint: String,
        filename: String
    }],
    timestamp: { type: Date, default: Date.now }
}, { bufferCommands: false });
const Video = mongoose.model("Video", videoSchema);

class video {
    screenShot(input, output, time) {
        return new Promise((resolve, reject) => {
            ffmpeg(input).seekInput(time).output(output).noAudio().frames(1).on("end", () => {
                resolve(true);
            }).on("error", err => {
                reject(err);
            }).run();
        });
    }
    probe(input) {
        return new Promise((resolve, reject) => {
            ffmpeg(input).ffprobe((err, metadata) => {
                if (err) reject(err);
                let probe = {};
                let format = metadata.format;
                if (format) {
                    let streams = metadata.streams;
                    let nb_streams = format.nb_streams;
                    for (let i=0; i<nb_streams; i++) {
                        if (streams[i].codec_type === "video") {
                            let frame_rate = streams[i].avg_frame_rate;
                            if (frame_rate && frame_rate.toUpperCase() !== "N/A") {
                                frame_rate = eval(frame_rate);
                            }
                            Object.assign(probe, {
                                fileurl: format.filename,
                                width: streams[i].width,
                                height: streams[i].height,
                                duration: parseFloat(format.duration) || parseFloat(streams[i].duration),
                                frame_rate: frame_rate
                            });
                        }
                    }
                }
                resolve(probe);
            });
        });
    }
    save(apikey, file) {
        return new Promise((resolve, reject) => {
            let video = new Video({
                apikey: apikey,
                originalname: file.originalname,
                destination: file.destination,
                filename: file.filename,
                cover: file.cover,
                width: file.width,
                height: file.height,
                duration: file.duration,
                frame_rate: file.frame_rate
            });
            video.save((err, video) => {
                if (err) reject(err);
                resolve(video);
            });
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            Video.findById(id, "-__v -timestamp", (err, video) => {
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
    remove(id) {
        return new Promise((resolve, reject) => {
            Video.findByIdAndRemove(id,
                { select: { timeslice: 0, __v: 0 } },
                (err, video) => {
                    if (err) reject(err);
                    resolve(video);
                }
            );
        });
    }
}
module.exports = video;
