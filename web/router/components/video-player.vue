<template>
    <div class="player">
        <div id="video-canvas" class="uk-width-1-1 uk-height-1-1"></div>
        <div class="uk-flex overlayer" v-if="loading">
            <div class="uk-margin-auto uk-margin-auto-vertical" uk-spinner></div>
        </div>
    </div>
</template>
<script>
    import UIkit from "uikit";
    import axios from "axios";
    import JSMpeg from "@lixuc/jsmpeg";
    import Map from "ol/map";
    import View from "ol/view";
    import Projection from "ol/proj/projection";
    import Control from "ol/control";
    import ImageLayer from "ol/layer/image";
    import ImageCanvas from "ol/source/imagecanvas";

    export default {
        props: ["src"],
        data() {
            return {
                loading: false,
                player: null,
                video: null,
                map: null,
                context: null,
                center: [0, 0],
                dx: 0,
                dy: 0
            }
        },
        mounted() {
            this.init();
        },
        watch: {
            "$route": "init",
            "video.currentFrame": function(frame) {
                if (frame > 0) {
                    if (frame === 1) {
                        let videoLayer = new ImageLayer({
                            source: new ImageCanvas({
                                canvasFunction: (extent, resolution, pixelRatio,
                                    size, projection) => {
                                    let center = this.map.getView().getCenter();
                                    let canvas = document.createElement("canvas");
                                    this.context = canvas.getContext("2d");
                                    canvas.setAttribute("width", size[0]);
                                    canvas.setAttribute("height", size[1]);

                                    this.dx += this.center[0] - center[0];
                                    this.dy += center[1] - this.center[1];

                                    this.center = center;

                                    this.context.putImageData(this.video.destination.imageData,
                                        this.dx, this.dy);
                                    return canvas;
                                },
                                ratio: 1,
                                resolutions: [1]
                            })
                        });
                        this.map.addLayer(videoLayer);
                        this.loading = false;
                    } else {
                        this.context.putImageData(this.video.destination.imageData, this.dx, this.dy);
                        this.map.render();
                    }
                }
            }
        },
        methods: {
            init() {
                this.loading = true;
                this.player = new JSMpeg.Player(this.src, {
                    disableGl: true,
                    silence: true
                });
                this.video = this.player.video;
                this.map = new Map({
                    target: "video-canvas",
                    pixelRatio: 1,
                    layers: [],
                    controls: Control.defaults({ zoom: false }),
                    logo: false,
                    view: new View({
                        projection: new Projection({
                            code: "video-image",
                            units: "pixels"
                        }),
                        center: [0, 0],
                        resolution: 1
                    })
                });
            }
        },
        beforeRouteLeave(to, from, next) {
            if (this.player) this.player.destroy();
            next();
        }
    }
</script>
<style scoped>
    .player {
        width: 100%;
        height: 400px;
    }
    .overlayer {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
</style>
