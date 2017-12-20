<i18n>
    {
        "en": {
            "cod": "Detection",
            "cic": "Classification",
            "no-data": "The API is not exist.",
            "bind": "Bind"
        },
        "zh-CN": {
            "cod": "检测",
            "cic": "分类",
            "no-data": "接口不存在！",
            "bind": "绑定"
        }
    }
</i18n>
<template>
    <div>
        <div class="uk-flex" v-if="loading">
            <div class="uk-margin-auto uk-margin-auto-vertical"
                uk-spinner="ratio: .8" key="spinner"></div>
        </div>
        <div class="uk-flex" v-else-if="Object.keys(apis).length === 0">
            <div class="uk-margin-auto uk-margin-auto-vertical uk-text-meta" key="no-data">
                {{ $t("no-data") }}
            </div>
        </div>
        <div class="uk-text-small" v-else>
            <ul class="uk-list uk-margin-remove">
                <li v-for="[usage, apis] of entries">
                    <span class="uk-label">
                        {{ $t(usage) }}
                    </span>
                    <ul class="uk-list api-list">
                        <li v-for="api of apis" class="uk-text-truncate">
                            <label uk-tooltip :title="api.categories">
                                <input type="radio" class="uk-radio"
                                    v-if="usage === 'cod'" :checked="api.selected"
                                    @click="selectCod(api.id)"
                                    :disabled="api.status === 'bind' || status !== ''">
                                <input type="checkbox" class="uk-checkbox"
                                    v-else-if="usage === 'cic'" v-model="api.selected"
                                    :disabled="api.status === 'bind' || status !== ''">
                                {{ api.categories }}
                            </label>
                        </li>
                    </ul>
                </li>
            </ul>
            <hr class="uk-margin-small">
            <button class="uk-button uk-button-default uk-button-small uk-align-right uk-margin-remove"
                :disabled="Object.keys(bundles).length === 0 || status !== ''"
                @click="bind()">
                {{ $t("bind") }}
                <div uk-spinner="ratio: .5" v-if="status === 'binding'"></div>
                <span uk-icon="icon: plus; ratio: .7" v-else></span>
            </button>
        </div>
        <!-- <ul class="uk-list uk-margin-remove" v-else>
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
        </ul> -->
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
                apis: {},
                status: ""
            }
        },
        computed: {
            entries() {
                return Object.entries(this.apis).sort().reverse();
            },
            bundles() {
                let bundles = {};
                if (this.apis.cod) {
                    let sel = this.apis.cod.find(api => api.status !== "bind" && api.selected);
                    if (sel) bundles["cod"] = sel.id;
                }
                if (this.apis.cic) {
                    let sels = this.apis.cic.filter(api => api.status !== "bind" && api.selected);
                    if (sels.length) bundles["cic"] = sels.map(sel => sel.id);
                }
                return bundles;
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
                        if (api.usage === "cod") {
                            if (!this.apis.cod) this.$set(this.apis, "cod", []);
                            this.apis.cod.push({
                                id: api._id,
                                categories: categories,
                                status: api.status,
                                selected: false
                            });
                        } else if (api.usage === "cic") {
                            if (!this.apis.cic) this.$set(this.apis, "cic", []);
                            this.apis.cic.push({
                                id: api._id,
                                categories: categories,
                                status: api.status,
                                selected: false
                            });
                        }
                    }
                }).catch(err => {
                    this.loading = false;
                    UIkit.notification(this.$t("global.error.500"), "danger");
                });
            },
            selectCod(id) {
                let cod = this.apis.cod.find(api => api.id === id);
                if (cod.selected) {
                    cod.selected = false;
                } else {
                    let sel = this.apis.cod.find(api => api.status !== "bind" && api.selected);
                    if (sel) sel.selected = false;
                    cod.selected = true;
                }
            },
            bind() {
                this.status = "binding";
                axios.post("video/bind", {
                    url: this.stream_api,
                    api: this.bundles
                }).then(res => {
                    let api = res.data.api;
                    if (api.cod) {
                        this.apis.cod.find(_api => _api.id === api.cod).status = "bind";
                    }
                    if (api.cic) {
                        this.apis.cic.filter(_api => api.cic.includes(_api.id)).forEach(_api => {
                            _api.status = "bind";
                        });
                    }
                    this.status = "";
                }).catch(err => {
                    this.status = "";
                    UIkit.notification(this.$t("global.error.500"), "danger");
                });
            },
            unbind(id) {
                // let api = this.apis.find(api => api.id === id);
                // api.status = "operating";
                // axios.post("video/unbind/" + id, {
                //     url: this.stream_api
                // }).then(res => {
                //     console.log("unbind API", res.data);
                //     api.status = "unbind";
                // }).catch(err => {
                //     api.status = "bind";
                //     UIkit.notification(this.$t("global.error.500"), "danger");
                // });
            }
        }
    }
</script>
<style scoped>
    .api-list {
        padding-left: 10px;
    }
</style>
