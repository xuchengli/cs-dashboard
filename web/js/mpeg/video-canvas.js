import JSMpeg from "@lixuc/jsmpeg";

class videoCanvas {
    constructor() {
        this.enabled = true;
        this.canvas = document.createElement("canvas");
        this.x = this.y = 0;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.context = this.canvas.getContext("2d");
    }
    destroy() {
        this.enabled = false;
        this.canvas = null;
        this.context = null;
    }
    resize(width, height) {
        this.width = width|0;
        this.height = height|0;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.imageData = this.context.getImageData(this.x, this.y, this.width, this.height);
        JSMpeg.Fill(this.imageData.data, 255);
    }
    renderProgress(progress) {
        this.context.fillStyle = "#222";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#fff";
        this.context.fillRect(0, this.canvas.height * (1 - progress / 100),
            this.canvas.width, this.canvas.height * (progress / 100));
    }
    render(y, cb, cr) {
        this.YCbCrToRGBA(y, cb, cr, this.imageData.data);
        this.context.putImageData(this.imageData, this.x, this.y);
    }
    YCbCrToRGBA(y, cb, cr, rgba) {
        JSMpeg.Renderer.Canvas2D.prototype.YCbCrToRGBA.call(this, y, cb, cr, rgba);
    }
}
export default videoCanvas;
