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
            "prompt-msg": "Video stream URL: ",
            "prompt-msg-eg": "e.g.",
            "cancel": "Cancel",
            "ok": "Ok",
            "add-video": "Add Video",
            "select-plugin": "Please select a plugin.",
            "select-upload-type": "Please select the way to upload.",
            "upload-type": "Upload type"
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
            "prompt-msg": "视频流地址：",
            "prompt-msg-eg": "例如",
            "cancel": "取消",
            "ok": "确定",
            "add-video": "添加视频",
            "select-plugin": "请选择插件",
            "select-upload-type": "请选择上传方式",
            "upload-type": "上传方式"
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
                    uk-margin-left uk-margin-bottom uk-inline video"
                    v-for="video of currentPage"
                    @mouseenter="video.overlay = true;" @mouseleave="video.overlay = false;">
                    <img :src="video.cover" class="uk-width-1-1 uk-height-1-1">
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
                    <button class="uk-button uk-button-primary" type="button" :disabled="uploading"
                            uk-toggle="target: #select-id">{{ $t("add-video") }}</button>
                </div>
                <div id="select-id" uk-modal="center: true">
                    <div class="uk-modal-dialog uk-modal-body">
                        <button class="uk-modal-close-default" type="button" uk-close></button>
                        <h2 class="uk-modal-title">{{ $t("add-video") }}</h2>
                        <form class="uk-form-stacked uk-margin-large">

                            <div class="uk-margin">
                                <label class="uk-form-label" for="form-horizontal-select">{{ $t("select-plugin") }}</label>
                                <div class="uk-form-controls">
                                    <select class="uk-select" id="form-horizontal-select" v-model="pluginId">
                                        <option v-for="p in plugins" :value="p.id">{{ p.name.en }}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="uk-margin">
                                <div class="uk-form-label">{{ $t("select-upload-type") }}</div>
                                <div class="uk-form-controls uk-form-controls-text">
                                    <label><input class="uk-radio" type="radio" name="radio1"
                                                  v-model="selectRadio" value="upload"> {{ $t("upload") }}</label><br>
                                    <label><input class="uk-radio" type="radio" name="radio1"
                                                  v-model="selectRadio" value="open"> {{ $t("video-stream") }}</label>
                                </div>
                            </div>

                            <div class="uk-margin" v-show="selectRadio === 'upload'">
                                <label class="uk-form-label">{{ $t("upload-type") }}</label>
                                <div class="uk-form-controls">
                                    <div id="uploader" uk-form-custom  @click="hide">
                                        <input type="file">
                                        <button class="uk-button uk-button-primary" type="button"
                                                tabindex="-1">
                                            {{ $t("upload") }}
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div class="uk-margin" v-show="selectRadio === 'open'">
                                <label class="uk-form-label">{{ $t("prompt-msg") }}</label>
                                <div class="uk-form-controls">
                                    <div class="uk-text-muted uk-text-small">{{ $t("prompt-msg-eg") }}: "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov"</div>
                                    <input class="uk-input" type="text"  v-model="openUrl">
                                </div>
                            </div>
                            <p class="uk-text-right">
                                <button class="uk-button uk-button-default uk-modal-close" type="button">{{ $t("cancel") }}</button>
                                <button class="uk-button uk-button-primary" type="button" @click="openStream">{{ $t("ok") }}</button>
                            </p>
                        </form>
                    </div>
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
                timer: null,
                selectRadio: "",
                openUrl: "",
                pluginId: "",
                plugins: []
            };
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
            this.load();
        },
        watch: {
            "$route": "load"
        },
        methods: {
            getPlugins() {
                return new Promise((resolve, reject) => {
                    axios.get("video/plugins").then(res => {
                        resolve(res.data);
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            getVideos() {
                return new Promise((resolve, reject) => {
                    axios("video/list").then(res => {
                        resolve(res.data);
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            async load() {
                this.loading = true;
                let videos = await this.getVideos();
                for (let video of videos) {
                    this.videos.push({
                        id: video._id,
                        cover: "video/" + video._id + "/cover",
                        overlay: false
                    });
                }
                this.plugins = await this.getPlugins();
                this.pluginId = this.plugins.length ? this.plugins[0].id : "";
                this.loading = false;
                this.$nextTick(() => {
                    UIkit.upload("#uploader", {
                        url: "video/upload",
                        name: "video",
                        mime: "video/*",
                        dataType: "json",
                        params: { pluginId: this.pluginId },
                        fail: () => {
                            UIkit.notification(this.$t("invalid-mime-msg"), "warning");
                        },
                        loadStart: () => {
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
                        error: () => {
                            this.uploading = false;
                            this.uploadedPercentage = 100;
                            UIkit.notification(this.$t("upload-fail-msg"), "danger");
                        }
                    });
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
                    axios.delete("video/" + id).then(() => {
                        this.videos.splice(this.videos.findIndex(video => video.id === id), 1);
                    }).catch(() => {
                        UIkit.notification(this.$t("global.error.500"), "danger");
                    });
                }, () => {});
            },
            openStream() {
                if (this.openUrl) {
                    this.uploading = true;
                    this.uploadedPercentage = 0;
                    this.trickProgress();
                    axios.post("video/stream", { url: this.openUrl, pluginId: this.pluginId}).then(res => {
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
                    }).catch(() => {
                        this.uploading = false;
                        this.uploadedPercentage = 100;
                        UIkit.notification(this.$t("global.error.500"), "danger");
                    });
                }
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
            },
            hide() {
                let select = UIkit.modal("#select-id");
                select.hide();
            }
        },
        components: {
            TopProgress
        }
    };
</script>
<style scoped>
    .video {
        width: 190px;
        height: 127px;
    }
</style>
