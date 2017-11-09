<i18n>
    {
        "en": {
            "edit": "Edit",
            "delete": "Delete",
            "upload": "Upload Video",
            "video-stream": "Open Video Stream",
            "empty": "No data.",
            "invalid-mime-msg": "Only video files are allowed.",
            "upload-fail-msg": "Upload failed.",
            "read-stream-fail-msg": "Read video stream failed.",
            "confirm-msg": "Are you sure to delete the video?",
            "prompt-msg": "Video stream URL: <p class='uk-text-meta uk-margin-small-bottom'>e.g., {example}</p>",
            "cancel": "Cancel",
            "ok": "Ok"
        },
        "zh-CN": {
            "edit": "编辑",
            "delete": "删除",
            "upload": "上传视频",
            "video-stream": "打开视频流",
            "empty": "没有记录！",
            "invalid-mime-msg": "只能上传视频文件！",
            "upload-fail-msg": "上传失败！",
            "read-stream-fail-msg": "读取视频流失败！",
            "confirm-msg": "你确信要删除这个视频吗？",
            "prompt-msg": "视频流地址：<p class='uk-text-meta uk-margin-small-bottom'>例如，{example}</p>",
            "cancel": "取消",
            "ok": "确定"
        }
    }
</i18n>
<template>
    <div class="uk-container uk-width-1-1 uk-padding-remove">
        <top-progress :percentage="uploadedPercentage"></top-progress>
        <router-view></router-view>
        <div class="uk-flex" uk-height-viewport="offset-top: true" v-if="loading">
            <div class="uk-margin-auto uk-margin-auto-vertical" uk-spinner="ratio: 1.5"></div>
        </div>
        <div v-else>
            <div class="uk-flex uk-flex-wrap uk-flex-wrap-top uk-width-1-1"
                uk-height-viewport="offset-top: true; offset-bottom: true" v-if="totalRow">
                <div class="uk-box-shadow-small uk-box-shadow-hover-large
                    uk-margin-left uk-margin-bottom uk-inline"
                    v-for="video of currentPage"
                    @mouseenter="video.overlay = true;" @mouseleave="video.overlay = false;">
                    <img :src="video.cover" class="video">
                    <div class="uk-position-center" v-if="video.overlay">
                        <a class="uk-icon-button" uk-icon="icon: pencil"
                            :class="{ 'uk-disabled': uploading }" uk-tooltip :title="$t('edit')"
                            @click="edit(video.id)"></a>
                        <a class="uk-icon-button uk-margin-small-left" uk-icon="icon: trash"
                            :class="{ 'uk-disabled': uploading }" uk-tooltip :title="$t('delete')"
                            @click="remove(video.id)"></a>
                    </div>
                </div>
            </div>
            <div class="uk-flex" uk-height-viewport="offset-top: true; offset-bottom: true" v-else>
                <span class="uk-text-large uk-margin-auto uk-margin-auto-vertical">
                    {{ $t("empty") }}
                </span>
            </div>
            <div class="uk-flex uk-flex-between uk-flex-middle
                uk-padding-small uk-padding-remove-horizontal uk-padding-remove-top">
                <div class="uk-margin-left">
                    <div id="uploader" uk-form-custom>
                        <input type="file" :disabled="uploading">
                        <button class="uk-button uk-button-primary" type="button"
                            tabindex="-1" :disabled="uploading">
                            {{ $t("upload") }}
                        </button>
                    </div>
                    <button class="uk-button uk-button-secondary uk-margin-small-left"
                        type="button" :disabled="uploading" @click="openStream">
                        {{ $t("video-stream") }}
                    </button>
                </div>
                <ul class="uk-pagination uk-margin-remove-vertical uk-margin-right" v-if="totalPage > 1">
                    <li v-for="no of totalPage" :class="{ 'uk-active': no === pageNo }">
                        <span v-if="uploading || no === pageNo">{{ no }}</span>
                        <a v-else @click="pageNo = no">{{ no }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import UIkit from "uikit";
    import axios from "axios";
    import TopProgress from "../../components/top-progress.vue";

    export default {
        data() {
            return {
                loading: false,
                videos: [],
                maxRowOnPage: 18,
                pageNo: 1,
                uploading: false,
                uploadedPercentage: 0,
                timer: null
            }
        },
        computed: {
            totalRow() {
                return this.videos.length;
            },
            totalPage() {
                return this.totalRow % this.maxRowOnPage === 0 ?
                        this.totalRow / this.maxRowOnPage :
                        Math.floor(this.totalRow / this.maxRowOnPage) + 1;
            },
            currentPage() {
                let from = (this.pageNo - 1) * this.maxRowOnPage;
                let to = Math.min(this.pageNo * this.maxRowOnPage, this.totalRow);
                return this.videos.slice(from, to);
            }
        },
        created() {
            this.getVideos();
        },
        watch: {
            "$route": "getVideos"
        },
        methods: {
            getVideos() {
                this.loading = true;
                axios("video/list").then(res => {
                    this.loading = false;
                    for (let video of res.data) {
                        this.videos.push({
                            id: video._id,
                            cover: "video/" + video._id + "/cover",
                            overlay: false
                        });
                    }
                    this.$nextTick(() => {
                        UIkit.upload("#uploader", {
                            url: "video/upload",
                            name: "video",
                            mime: "video/*",
                            dataType: "json",
                            fail: e => {
                                UIkit.notification(this.$t("invalid-mime-msg"), "warning");
                            },
                            loadStart: e => {
                                this.uploading = true;
                                this.uploadedPercentage = 0;
                            },
                            progress: e => {
                                if (e.loaded && e.total) {
                                    this.uploadedPercentage = e.loaded / e.total * 100;
                                }
                            },
                            completeAll: e => {
                                this.uploading = false;
                                this.uploadedPercentage = 100;
                                if (e.status === 200) {
                                    let response = JSON.parse(e.responseText);
                                    this.videos.unshift({
                                        id: response._id,
                                        cover: "video/" + response._id + "/cover",
                                        overlay: false
                                    });
                                } else {
                                    UIkit.notification(this.$t("upload-fail-msg"), "danger");
                                }
                            },
                            error: e => {
                                this.uploading = false;
                                this.uploadedPercentage = 100;
                                UIkit.notification(this.$t("upload-fail-msg"), "danger");
                            }
                        });
                    });
                }).catch(err => {
                    this.loading = false;
                    UIkit.notification(this.$t("global.error.500"), "danger");
                });
            },
            edit(id) {
                this.$router.push("/video/" + id);
            },
            remove(id) {
                UIkit.modal.confirm(this.$t("confirm-msg"), {
                    labels: {
                        ok: this.$t("ok"),
                        cancel: this.$t("cancel")
                    }
                }).then(() => {
                    axios.delete("video/" + id).then(res => {
                        this.videos.splice(this.videos.findIndex(video => video.id === id), 1);
                    }).catch(err => {
                        UIkit.notification(this.$t("global.error.500"), "danger");
                    });
                }, () => {});
            },
            openStream() {
                UIkit.modal.prompt(
                    this.$t("prompt-msg", {
                        example: "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov"
                    }),
                    "",
                    {
                        labels: {
                            ok: this.$t("ok"),
                            cancel: this.$t("cancel")
                        }
                    }
                ).then(url => {
                    if (url) {
                        this.uploading = true;
                        this.uploadedPercentage = 0;
                        this.trickProgress();
                        axios.post("video/stream", { url: url }).then(res => {
                            this.uploading = false;
                            this.uploadedPercentage = 100;
                            if (res.status === 200) {
                                this.videos.unshift({
                                    id: res.data._id,
                                    cover: "video/" + res.data._id + "/cover",
                                    overlay: false
                                });
                            } else {
                                UIkit.notification(this.$t("read-stream-fail-msg"), "danger");
                            }
                        }).catch(err => {
                            this.uploading = false;
                            this.uploadedPercentage = 100;
                            UIkit.notification(this.$t("global.error.500"), "danger");
                        });
                    }
                });
            },
            trickProgress() {
                if (this.uploadedPercentage < 90) {
                    this.uploadedPercentage += 10;
                } else if (this.uploadedPercentage < 100) {
                    this.uploadedPercentage++;
                }
                if (this.timer) clearTimeout(this.timer);
                if (this.uploadedPercentage < 100) {
                    this.timer = setTimeout(() => {
                        this.trickProgress();
                    }, this.uploadedPercentage * Math.round(50 * Math.random()));
                }
            }
        },
        components: {
            TopProgress
        }
    }
</script>
<style scoped>
    .video {
        width: 190px;
        height: 127px;
    }
</style>
