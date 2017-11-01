import "uikit/dist/css/uikit.css";
import Vue from "vue";
import VueI18n from "vue-i18n";
import VueCookie from "vue-cookie";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import router from "../router";
import LocaleSelect from "../components/locale-select.vue";
import "./icons";

UIkit.use(Icons);
Vue.use(VueI18n);
Vue.use(VueCookie);
Vue.component("locale-select", LocaleSelect);

let lang = Vue.cookie.get("locale") || navigator.language || navigator.userLanguage;
if (lang != "en" && lang != "zh-CN") lang = "en";

const i18n = new VueI18n({
    locale: lang,
    silentTranslationWarn: true,
    messages: {
        "en": {
            "global": {
                "error": {
                    "500": "Internal Server Error."
                }
            }
        },
        "zh-CN": {
            "global": {
                "error": {
                    "500": "服务器异常，请稍后再试！"
                }
            }
        }
    }
});
new Vue({
    i18n,
    router,
    data: {
        locale: lang
    },
    watch: {
        locale(lng) {
            i18n.locale = lng;
            this.$cookie.set("locale", lng, { expires: "1Y" });
        }
    }
}).$mount("#app");
