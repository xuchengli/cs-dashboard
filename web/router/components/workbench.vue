<i18n>
    {
        "en": {
            "my-videos": "My videos",
            "toolkit": "Toolkit",
            "api": "API",
            "event-monitor": "Event monitor",
            "error404": "The video is not exist."
        },
        "zh-CN": {
            "my-videos": "我的视频",
            "toolkit": "工具箱",
            "api": "视频识别接口",
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
                <div class="uk-flex uk-flex-column uk-width-1-6">
                    <div class="uk-card uk-card-default">
                        <div class="uk-card-header uk-card-content-padding">
                            <h4 class="uk-h4">{{ $t("toolkit") }}</h4>
                        </div>
                        <div class="uk-card-body uk-card-content-padding">
                            <router-view name="toolkit" @select="select"></router-view>
                        </div>
                    </div>
                    <div class="uk-card uk-card-default uk-margin-top">
                        <div class="uk-card-header uk-card-content-padding">
                            <h4 class="uk-h4">{{ $t("api") }}</h4>
                        </div>
                        <div class="uk-card-body uk-card-content-padding">
                            <router-view name="api-list" :stream_api="video.stream_api"></router-view>
                        </div>
                    </div>
                </div>
                <div class="uk-card uk-card-default uk-margin-left uk-width-expand">
                    <div class="uk-card-body uk-padding-remove video-player">
                        <router-view name="video-player" :src="video.stream_address" :handle="handle">
                        </router-view>
                    </div>
                    <div class="uk-card-footer uk-padding-remove video-timeline">
                        <router-view name="timeline"></router-view>
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

    export default {
        props: ["id"],
        data() {
            return {
                loading: false,
                video: {},
                handle: ""
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
                }).catch(err => {
                    this.loading = false;
                    if (err.response.status === 404) {
                        UIkit.notification(this.$t("error404"), "danger");
                    } else if (err.response.status === 500) {
                        UIkit.notification(this.$t("global.error.500"), "danger");
                    }
                });
            },
            select(tool) {
                this.handle = tool;
            }
        }
    }
</script>
<style scoped>
    .uk-card-content-padding {
        padding: 15px 20px;
    }
    .uk-card-content-padding .uk-h4 {
        color: #666;
    }
    .video-player {
        height: 90%;
    }
    .video-timeline {
        height: 10%;
    }
</style>
