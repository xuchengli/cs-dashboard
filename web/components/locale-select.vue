<template>
    <div class="uk-position-top-right uk-position-small">
        <a><img :src="flag" width="24" height="24"></a>
        <div uk-dropdown class="uk-padding-remove locale-list">
            <ul class="uk-nav uk-dropdown-nav">
                <li v-for="(f, l) in list" @click="changeLanguage(l)">
                    <a class="uk-padding-remove">
                        <img :src="f" width="24" height="24">
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import UIkit from "uikit";
    import enPng from "../images/en.png";
    import zhPng from "../images/zh-CN.png";

    export default {
        props: {
            locale: {
                type: String,
                default: "en"
            }
        },
        data() {
            return {
                locales: new Map([
                    ["en", enPng],
                    ["zh-CN", zhPng]
                ])
            }
        },
        computed: {
            flag() {
                return this.locales.get(this.locale);
            },
            list() {
                return [...this.locales].filter(([locale, flag]) => locale != this.locale)
                    .reduce((obj, arr) => Object.assign(obj, { [arr[0]]: arr[1] }), {});
            }
        },
        methods: {
            changeLanguage(lang) {
                UIkit.dropdown(".locale-list").hide(false);
                this.$emit("update:locale", lang);
            }
        }
    }
</script>
<style scoped>
    .locale-list {
        min-width: auto;
        background: transparent;
        box-shadow: initial;
    }
</style>
