const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const config = require("./configuration");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    apikey: { type: String, required: true },
    source_type: String,
    originalname: String,
    destination: String,
    filename: String,
    cover: String,
    stream_id: String,
    stream_address: String,
    stream_api: String,
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
    save(apikey, file) {
        return new Promise((resolve, reject) => {
            let video = new Video({
                apikey: apikey,
                source_type: file.source_type,
                originalname: file.originalname,
                destination: file.destination,
                filename: file.filename,
                cover: file.cover
            });
            video.save((err, video) => {
                if (err) reject(err);
                resolve(video);
            });
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            Video.findById(id, "-__v -timestamp", { lean: true }, (err, video) => {
                if (err) reject(err);
                resolve(video);
            });
        });
    }
    list(apikey) {
        return new Promise((resolve, reject) => {
            Video.find(
                { apikey: apikey },
                "-__v",
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
                { select: { __v: 0 } },
                (err, video) => {
                    if (err) reject(err);
                    resolve(video);
                }
            );
        });
    }
    createStream(src, api) {
        return new Promise((resolve, reject) => {
            axios.post(config.Video_Stream_API, {
                video_src: src,
                api: api
            }).then(res => resolve(res.data)).catch(err => reject(err));
        });
    }
    setStream(videoId, stream) {
        return new Promise((resolve, reject) => {
            Video.findByIdAndUpdate(videoId,
                {
                    $set: {
                        stream_id: stream.stream_id,
                        stream_address: stream.stream_address,
                        stream_api: stream.stream_api
                    }
                },
                { new: true, select: { __v: 0 } },
                (err, video) => {
                    if (err) reject(err);
                    resolve(video);
                }
            );
        });
    }
    bindAPI(url, api) {
        return new Promise((resolve, reject) => {
            axios.post("/api/operate", {
                action: "add",
                api: api
            }, { baseURL: url }).then(res => resolve(res.data)).catch(err => reject(err));
        });
    }
    unbindAPI(url, api) {
        return new Promise((resolve, reject) => {
            axios.post("/api/operate", {
                action: "remove",
                api: api
            }, { baseURL: url }).then(res => resolve(res.data)).catch(err => reject(err));
        });
    }
    deleteStream(id) {
        return new Promise((resolve, reject) => {
            axios.delete(config.Video_Stream_API, {
                data: { id: id }
            }).then(res => resolve(res.data)).catch(err => reject(err));
        });
    }
}
module.exports = video;
