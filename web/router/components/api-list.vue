<i18n>
    {
        "en": {
            "cod": "Detection",
            "cic": "Classification",
            "no-data": "The API is not exist.",
            "bind": "Bind",
            "unbind": "Unbind"
        },
        "zh-CN": {
            "cod": "检测",
            "cic": "分类",
            "no-data": "接口不存在！",
            "bind": "绑定",
            "unbind": "解绑"
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
        <div class="uk-flex uk-flex-column uk-text-small" v-else>
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
            <button class="uk-button uk-button-default uk-button-small uk-margin-small-top"
                :disabled="Object.keys(bundle).length === 0 || status !== ''"
                @click="bind()">
                {{ $t("bind") }}
                <div uk-spinner="ratio: .5" v-if="status === 'binding'"></div>
                <span uk-icon="icon: plus-circle; ratio: .7" v-else></span>
            </button>
            <ul class="uk-list uk-margin-remove-bottom uk-margin-small-top">
                <li v-for="reducedBundle of reducedBundles">
                    <div class="uk-flex uk-flex-between uk-flex-middle">
                        <label class="uk-text-truncate" uk-tooltip :title="reducedBundle.category">
                            {{ reducedBundle.category }}
                        </label>
                        <div uk-spinner="ratio: .5" v-if="reducedBundle.status === 'unbinding'"></div>
                        <a uk-icon="icon: minus-circle; ratio: .7" uk-tooltip :title="$t('unbind')"
                            @click="unbind(reducedBundle.id)" v-else></a>
                    </div>
                </li>
            </ul>
        </div>
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
                /**
                 * apis格式：
                 * {
                 *   cod: [
                 *     {
                 *       id: "xxxx",
                 *       categories: "xxxx",
                 *       status: "xxxx",
                 *       selected: true/false
                 *     },
                 *     {...}
                 *   ],
                 *   cic: [
                 *     {
                 *       id: "xxxx",
                 *       categories: "xxxx",
                 *       status: "xxxx",
                 *       selected: true/false
                 *     },
                 *     {...}
                 *   ]
                 * }
                 */
                apis: {},
                status: "",
                /**
                 * bundles格式：
                 * [
                 *   {
                 *     id: "xxxx",
                 *     api: {
                 *       cod: {
                 *         id: "xxxx",
                 *         categories: "xxxx",
                 *         status: "xxxx",
                 *         selected: true/false
                 *       },
                 *       cic: [
                 *         {
                 *           id: "xxxx",
                 *           categories: "xxxx",
                 *           status: "xxxx",
                 *           selected: true/false
                 *         },
                 *         {...}
                 *       ]
                 *     },
                 *     status: "xxxx"
                 *   }
                 * ]
                 */
                bundles: []
            }
        },
        computed: {
            entries() {
                return Object.entries(this.apis).sort().reverse();
            },
            bundle() {
                let bundle = {};
                if (this.apis.cod) {
                    let sel = this.apis.cod.find(api => api.status !== "bind" && api.selected);
                    if (sel) bundle["cod"] = sel.id;
                }
                if (this.apis.cic) {
                    let sels = this.apis.cic.filter(api => api.status !== "bind" && api.selected);
                    if (sels.length) bundle["cic"] = sels.map(sel => sel.id);
                }
                return bundle;
            },
            reducedBundles() {
                let bundles = [];
                for (let _bundle of this.bundles) {
                    let bundle = {
                        id: _bundle.id,
                        status: _bundle.status
                    };
                    let category = "";
                    if (_bundle.api.cod) {
                        category += _bundle.api.cod.categories;
                    }
                    if (_bundle.api.cic) {
                        category += "[" + _bundle.api.cic.map(cic => cic.categories).join(",") + "]";
                    }
                    bundle["category"] = category;
                    bundles.push(bundle);
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
                    api: this.bundle
                }).then(res => {
                    let bundle = {
                        id: res.data.id,
                        api: {},
                        status: "ready"
                    };
                    let api = res.data.api;
                    if (api.cod) {
                        let _cod = this.apis.cod.find(_api => _api.id === api.cod);
                        _cod.status = "bind";
                        bundle.api["cod"] = _cod;
                    }
                    if (api.cic) {
                        let _cic = this.apis.cic.filter(_api => api.cic.includes(_api.id));
                        _cic.forEach(_api => { _api.status = "bind"; });
                        bundle.api["cic"] = _cic;
                    }
                    this.bundles.push(bundle);
                    this.status = "";
                }).catch(err => {
                    this.status = "";
                    UIkit.notification(this.$t("global.error.500"), "danger");
                });
            },
            unbind(id) {
                this.status = "unbinding";
                this.bundles.find(bundle => bundle.id === id).status = "unbinding";
                axios.delete("video/unbind/" + id, {
                    data: { url: this.stream_api }
                }).then(res => {
                    let bundle = this.bundles.splice(
                        this.bundles.findIndex(bundle => bundle.id === id), 1);
                    if (bundle.length) {
                        if (bundle[0].api.cod) {
                            let _cod = this.apis.cod.find(_api => _api.id === bundle[0].api.cod.id);
                            _cod.status = "ready";
                            _cod.selected = false;
                        }
                        if (bundle[0].api.cic) {
                            let _cic = this.apis.cic.filter(
                                _api => bundle[0].api.cic.map(cic => cic.id).includes(_api.id));
                            _cic.forEach(_api => {
                                _api.status = "ready";
                                _api.selected = false;
                            });
                        }
                    }
                    this.status = "";
                }).catch(err => {
                    this.status = "";
                    UIkit.notification(this.$t("global.error.500"), "danger");
                });
            }
        }
    }
</script>
<style scoped>
    .api-list {
        padding-left: 10px;
    }
</style>
