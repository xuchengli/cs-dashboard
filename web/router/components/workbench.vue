<i18n>
    {
        "en": {
            "my-videos": "My videos",
            "toolkit": "Toolkit",
            "api": "API",
            "event-monitor": "Event monitor",
            "error404": "The video is not exist.",
            "read-stream-fail": "Read video stream failed."
        },
        "zh-CN": {
            "my-videos": "我的视频",
            "toolkit": "工具箱",
            "api": "视频识别接口",
            "event-monitor": "事件监控",
            "error404": "视频不存在！",
            "read-stream-fail": "读取视频流失败！"
        }
    }
</i18n>
<template>
    <div class="uk-container uk-width-1-1 uk-padding-remove">
        <router-view></router-view>
        <div class="uk-flex" uk-height-viewport="offset-top: true" v-if="loading">
            <div class="uk-margin-auto uk-margin-auto-vertical" uk-spinner="ratio: 1.5"></div>
        </div>
        <div v-else>
            <ul class="uk-breadcrumb uk-padding-small uk-padding-remove-vertical">
                <li><router-link to="/videos">{{ $t("my-videos") }}</router-link></li>
                <li><span>{{ video.originalname }}</span></li>
            </ul>
            <div class="uk-flex uk-padding-small uk-padding-remove-top"
                uk-height-viewport="offset-top: true">
                <div class="uk-flex uk-flex-column uk-width-1-6">
                    <div class="uk-card uk-card-default">
                        <div class="uk-card-header uk-card-content-padding">
                            <h4 class="uk-h4">{{ $t("toolkit") }}</h4>
                        </div>
                        <div class="uk-card-body uk-card-content-padding
                            uk-flex uk-flex-wrap uk-flex-wrap-around">
                            <div class="uk-width-1-6"><icon name="image"></icon></div>
                            <div class="uk-width-1-6"><icon name="segment"></icon></div>
                            <div class="uk-width-1-6"><icon name="path"></icon></div>
                            <div class="uk-width-1-6"><icon name="curve"></icon></div>
                            <div class="uk-width-1-6"><icon name="square"></icon></div>
                            <div class="uk-width-1-6"><icon name="rectangle"></icon></div>
                            <div class="uk-width-1-6"><icon name="triangle"></icon></div>
                            <div class="uk-width-1-6"><icon name="circle"></icon></div>
                            <div class="uk-width-1-6"><icon name="ellipse"></icon></div>
                            <div class="uk-width-1-6"><icon name="polygon"></icon></div>
                            <div class="uk-width-1-6"><icon name="curveSurface"></icon></div>
                        </div>
                    </div>
                    <div class="uk-card uk-card-default uk-margin-top">
                        <div class="uk-card-header uk-card-content-padding">
                            <h4 class="uk-h4">{{ $t("api") }}</h4>
                        </div>
                        <div class="uk-card-body uk-card-content-padding">
                            <router-view name="api-list"></router-view>
                        </div>
                    </div>
                </div>
                <div class="uk-card uk-card-default uk-margin-left uk-width-expand">
                    <div class="uk-card-body uk-padding-remove">
                        <div id="video-canvas"></div>
                    </div>
                    <div class="uk-card-footer uk-padding-remove" v-if="stream">
                        {{ stream.currentFrame }}
                    </div>
                </div>
                <div class="uk-card uk-card-default uk-margin-left uk-width-1-5">
                    <div class="uk-card-header uk-card-content-padding">
                        <h4 class="uk-h4">{{ $t("event-monitor") }}</h4>
                    </div>
                </div>
            </div>
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
    import "vue-awesome/icons/image";

    export default {
        props: ["id"],
        data() {
            return {
                loading: false,
                video: {},
                map: null,
                stream: null,
                dx: 0,
                dy: 0,
                context: null,
                center: [0, 0]
            }
        },
        created() {
            this.getVideo();
        },
        watch: {
            "$route": "getVideo",
            "stream.currentFrame": function(frame) {
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

                                    this.context.putImageData(this.stream.destination.imageData,
                                        this.dx, this.dy);
                                    return canvas;
                                },
                                ratio: 1,
                                resolutions: [1]
                            })
                        });
                        this.map.addLayer(videoLayer);
                    } else {
                        this.context.putImageData(this.stream.destination.imageData, this.dx, this.dy);
                        this.map.render();
                    }
                }
            }
        },
        methods: {
            getVideo() {
                this.loading = true;
                axios("video/" + this.id).then(res => {
                    this.loading = false;
                    this.video = Object.assign({}, this.video, res.data);
                    this.$nextTick(() => {
                        let player = new JSMpeg.Player(this.video.websocket_stream, {
                            disableGl: true,
                            silence: true
                        });
                        player.source.socket.addEventListener("open", evt => {
                            this.stream = player.video;
                            let projection = new Projection({
                                code: "video-image",
                                units: "pixels"
                            });
                            this.map = new Map({
                                target: "video-canvas",
                                pixelRatio: 1,
                                layers: [],
                                controls: Control.defaults({ zoom: false }),
                                logo: false,
                                view: new View({
                                    projection: projection,
                                    center: [0, 0],
                                    resolution: 1
                                })
                            });
                        });
                        player.source.socket.addEventListener("error", evt => {
                            UIkit.notification(this.$t("read-stream-fail"), "danger");
                        });
                    });
                }).catch(err => {
                    this.loading = false;
                    if (err.response.status === 404) {
                        UIkit.notification(this.$t("error404"), "danger");
                    } else if (err.response.status === 500) {
                        UIkit.notification(this.$t("global.error.500"), "danger");
                    }
                });
            }
        }
    }
</script>
<style scoped>
    #video-canvas {
        width: 100%;
        height: 400px;
    }
    .uk-padding-xsmall {
        padding: 10px;
    }
    .uk-card-content-padding {
        padding: 15px 20px;
    }
    .uk-card-content-padding .uk-h4 {
        color: #666;
    }
</style>
