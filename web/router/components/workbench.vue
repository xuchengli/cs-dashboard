<i18n>
    {
        "en": {
            "my-videos": "My videos",
            "event-monitor": "Event monitor",
            "error404": "The video is not exist."
        },
        "zh-CN": {
            "my-videos": "我的视频",
            "event-monitor": "事件监控",
            "error404": "视频不存在！"
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
                <div class="uk-card uk-card-default uk-card-body uk-padding-xsmall
                    uk-flex uk-flex-column uk-width-auto">
                    <icon name="image"></icon>
                    <icon name="segment" class="uk-margin-small-top"></icon>
                    <icon name="path" class="uk-margin-small-top"></icon>
                    <icon name="curve" class="uk-margin-small-top"></icon>
                    <icon name="square" class="uk-margin-small-top"></icon>
                    <icon name="rectangle" class="uk-margin-small-top"></icon>
                    <icon name="triangle" class="uk-margin-small-top"></icon>
                    <icon name="circle" class="uk-margin-small-top"></icon>
                    <icon name="ellipse" class="uk-margin-small-top"></icon>
                    <icon name="polygon" class="uk-margin-small-top"></icon>
                    <icon name="curveSurface" class="uk-margin-small-top"></icon>
                </div>
                <div class="uk-card uk-card-default uk-margin-left uk-width-expand">
                    <div class="uk-card-body uk-padding-remove">
                        <canvas id="video-canvas"></canvas>
                    </div>
                    <div class="uk-card-footer uk-padding-remove">
                    </div>
                </div>
                <div class="uk-card uk-card-default uk-margin-left uk-width-1-4">
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
    import "vue-awesome/icons/image";

    export default {
        props: ["id"],
        data() {
            return {
                loading: false,
                video: {}
            }
        },
        created() {
            this.getVideo();
        },
        watch: {
            "$route": "getVideo"
        },
        methods: {
            getVideo() {
                this.loading = true;
                axios("video/" + this.id).then(res => {
                    this.loading = false;
                    this.video = Object.assign({}, this.video, res.data);
                    this.$nextTick(() => {
                        let canvas = document.getElementById("video-canvas");
                        let player = new JSMpeg.Player(this.video.websocket_stream, { canvas: canvas });
                        console.log(player.renderer);
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
