import JSMpeg from "@lixuc/jsmpeg";
import WebSocket from "./websocket";
import VideoCanvas from "./video-canvas";

class player {
    constructor(url) {
        this.source = new WebSocket(url);

        this.demuxer = new JSMpeg.Demuxer.TS();
        this.source.connect(this.demuxer);

        this.video = new JSMpeg.Decoder.MPEG1Video({
            videoBufferSize: 1024 * 1024,
            streaming: true
        });
        this.demuxer.connect(JSMpeg.Demuxer.TS.STREAM.VIDEO_1, this.video);

        this.renderer = new VideoCanvas();
        this.video.connect(this.renderer);

        let _unpauseOnShow = false;
        document.addEventListener("visibilitychange", evt => {
            if (document.visibilityState === "hidden") {
                _unpauseOnShow = this.wantsToPlay;
                this.pause();
            } else if (_unpauseOnShow) {
                this.play();
            }
        });
        this.progressEvent = new Event("progress");
        this.playEvent = new Event("play");

        this.source.start();
        this.play();
    }
    get currentTime() {
        return this.video.currentTime - this.video.startTime;
    }
    set currentTime(time) {
        this.seek(time);
    }
    play() {
        this.animationId = requestAnimationFrame(this.update.bind(this));
        this.wantsToPlay = true;
    }
    pause() {
        cancelAnimationFrame(this.animationId);
        this.wantsToPlay = false;
        this.isPlaying = false;
    }
    stop() {
        this.pause();
        this.seek(0);
        if (this.video) this.video.decode();
    }
    destroy() {
        this.pause();
        this.source.destroy();
        this.renderer.destroy();
    }
    seek(time) {
        let startOffset = this.video.startTime;
        if (this.video) {
            this.video.seek(time + startOffset);
        }
        this.startTime = JSMpeg.Now() - time;
    }
    update() {
        this.animationId = requestAnimationFrame(this.update.bind(this));
        if (!this.source.established) {
            this.renderer.renderProgress(this.source.progress);
            this.renderer.canvas.dispatchEvent(this.progressEvent);
        	return;
        }
        if (!this.isPlaying) {
            this.isPlaying = true;
        	this.startTime = JSMpeg.Now() - this.currentTime;
            this.renderer.renderProgress(this.source.progress);
            this.renderer.canvas.dispatchEvent(this.progressEvent);
        }
        if (this.video) {
            this.video.decode();
            this.renderer.canvas.dispatchEvent(this.playEvent);
        }
    }
}
export default player;
