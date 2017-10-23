<i18n>
    {
        "en": {
            "my-videos": "My videos"
        },
        "zh-CN": {
            "my-videos": "我的视频"
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
                }).catch(err => {
                    this.loading = false;
                    UIkit.notification(this.$t("global.error.500"), "danger");
                });
            }
        }
    }
</script>
