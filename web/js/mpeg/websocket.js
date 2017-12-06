import JSMpeg from "@lixuc/jsmpeg";

class websocket {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.destination = null;

        this.reconnectInterval = 5;
        this.shouldAttemptReconnect = true;

        this.established = false;
        this.progress = 0;

        this.reconnectTimeoutId = 0;
        this.progressTimeoutId = 0;
    }
    connect(destination) {
        this.destination = destination;
    }
    destroy() {
        clearTimeout(this.reconnectTimeoutId);
        clearTimeout(this.progressTimeoutId);
        this.shouldAttemptReconnect = false;
        this.socket.close();
    }
    start() {
        this.shouldAttemptReconnect = true;
        this.established = false;

        this.socket = new WebSocket(this.url);
        this.socket.binaryType = "arraybuffer";
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);

        this.trickProgress();
    }
    onOpen() {
        console.info("视频连接建立成功...");
    }
    onClose() {
        if (this.shouldAttemptReconnect) {
            if (this.reconnectTimeoutId) clearTimeout(this.reconnectTimeoutId);
            if (this.progress < 100) {
                this.reconnectTimeoutId = setTimeout(() => {
                    this.start();
                }, this.reconnectInterval * 1000);
            } else {
                console.error("视频连接失败!!!!");
            }
        }
    }
    onMessage(event) {
        if (this.destination) {
            this.destination.write(event.data);
            /**
             * 成功解码第一帧后，代表成功读取了有效视频流
             */
            if (this.progress !== 100 &&
                this.destination.pesPacketInfo[JSMpeg.Demuxer.TS.STREAM.VIDEO_1]
                    .destination.currentFrame > 0) {
                this.progress = 100;
                this.established = true;
            }
        }
    }
    trickProgress() {
        if (this.progressTimeoutId) clearTimeout(this.progressTimeoutId);
        if (this.progress < 100) {
            this.progress = this.progress < 90 ? this.progress + 5 : this.progress + 1;
            this.progressTimeoutId = setTimeout(() => {
                this.trickProgress();
            }, this.progress * Math.round(200 * Math.random()));
        }
    }
}
export default websocket;
