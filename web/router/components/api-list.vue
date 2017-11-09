<i18n>
    {
        "en": {
            "no-data": "The API is not exist."
        },
        "zh-CN": {
            "no-data": "接口不存在！"
        }
    }
</i18n>
<template>
    <div>
        <div class="uk-flex" v-if="loading">
            <div class="uk-margin-auto uk-margin-auto-vertical"
                uk-spinner="ratio: .8" key="spinner"></div>
        </div>
        <div class="uk-flex" v-else-if="apis.length === 0">
            <div class="uk-margin-auto uk-margin-auto-vertical uk-text-meta" key="no-data">
                {{ $t("no-data") }}
            </div>
        </div>
        <ul class="uk-list uk-margin-remove" v-else>
            <li v-for="api of apis">
                <div class="uk-flex uk-flex-between uk-flex-middle">
                    <span class="uk-text-truncate" uk-tooltip :title="api.categories">
                        {{ api.categories }}
                    </span>
                    <div uk-spinner="ratio: .7" v-if="api.status === 'operating'"></div>
                    <a uk-icon="icon: minus-circle" @click="unbind(api.id)"
                        v-else-if="api.status === 'bind'"></a>
                    <a uk-icon="icon: plus-circle" @click="bind(api.id)" v-else></a>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    import UIkit from "uikit";
    import axios from "axios";

    export default {
        props: ["stream_api"],
        data() {
            return {
                loading: false,
                apis: []
            }
        },
        created() {
            this.getAPIs();
        },
        watch: {
            "$route": "getAPIs"
        },
        methods: {
            getAPIs() {
                this.loading = true;
                axios("ai-vision/webapis").then(res => {
                    this.loading = false;
                    for (let api of res.data) {
                        let categories = api.categories.map(
                            category => category.category_name).join(",");
                        this.apis.push({
                            id: api._id,
                            categories: categories,
                            usage: api.usage,
                            status: api.status
                        });
                    }
                }).catch(err => {
                    this.loading = false;
                    UIkit.notification(this.$t("global.error.500"), "danger");
                });
            },
            bind(id) {
                let api = this.apis.find(api => api.id === id);
                api.status = "operating";
                axios.post("video/bind/" + id, {
                    url: this.stream_api
                }).then(res => {
                    console.log("bind API", res.data);
                    api.status = "bind";
                }).catch(err => {
                    api.status = "unbind";
                    UIkit.notification(this.$t("global.error.500"), "danger");
                });
            },
            unbind(id) {
                let api = this.apis.find(api => api.id === id);
                api.status = "operating";
                axios.post("video/unbind/" + id, {
                    url: this.stream_api
                }).then(res => {
                    console.log("unbind API", res.data);
                    api.status = "unbind";
                }).catch(err => {
                    api.status = "bind";
                    UIkit.notification(this.$t("global.error.500"), "danger");
                });
            }
        }
    }
</script>
