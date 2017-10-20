<i18n>
    {
        "en": {
            "play": "Play",
            "edit": "Edit",
            "delete": "Delete",
            "upload": "Upload",
            "empty": "No data.",
            "invalid-mime-msg": "Only video files are allowed.",
            "upload-fail-msg": "Upload failed."
        },
        "zh-CN": {
            "play": "播放",
            "edit": "编辑",
            "delete": "删除",
            "upload": "上传",
            "empty": "没有记录！",
            "invalid-mime-msg": "只能上传视频文件！",
            "upload-fail-msg": "上传失败！"
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
                    <img :src="video.cover">
                    <div class="uk-position-center" v-if="video.overlay">
                        <a class="uk-icon-button" uk-icon="icon: play"
                            :class="{ 'uk-disabled': uploading }" uk-tooltip :title="$t('play')"></a>
                        <a class="uk-icon-button uk-margin-small-left" uk-icon="icon: pencil"
                            :class="{ 'uk-disabled': uploading }" uk-tooltip :title="$t('edit')"></a>
                        <a class="uk-icon-button uk-margin-small-left" uk-icon="icon: trash"
                            :class="{ 'uk-disabled': uploading }" uk-tooltip :title="$t('delete')"></a>
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
                <div id="uploader" class="uk-margin-left" uk-form-custom>
                    <input type="file" :disabled="uploading">
                    <button class="uk-button uk-button-primary" type="button"
                        tabindex="-1" :disabled="uploading">
                        {{ $t("upload") }}
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
    import TopProgress from "../../components/top-progress.vue";

    export default {
        data() {
            return {
                loading: false,
                videos: [],
                maxRowOnPage: 18,
                pageNo: 1,
                uploading: false,
                uploadedPercentage: 0
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
                setTimeout(() => {
                    for (let i=0; i<7; i++) {
                        this.videos.push({
                            cover: "https://getuikit.com/docs/images/photo.jpg",
                            overlay: false
                        });
                        this.videos.push({
                            cover: "https://getuikit.com/docs/images/dark.jpg",
                            overlay: false
                        });
                        this.videos.push({
                            cover: "https://getuikit.com/docs/images/light.jpg",
                            overlay: false
                        });
                    }
                    this.loading = false;
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
                                if (e.status === 200) {
                                    let response = e.responseJSON;
                                    console.log(response);
                                } else {
                                    UIkit.notification(this.$t("upload-fail-msg"), "danger");
                                }
                            },
                            error: e => {
                                this.uploading = false;
                                UIkit.notification(this.$t("upload-fail-msg"), "danger");
                            }
                        });
                    });
                }, 3000);
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
