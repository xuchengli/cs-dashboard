import "uikit/dist/css/uikit.css";
import Vue from "vue";
import VueI18n from "vue-i18n";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import router from "../router";

UIkit.use(Icons);
Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: "zh-CN",
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
    router
}).$mount("#app");
