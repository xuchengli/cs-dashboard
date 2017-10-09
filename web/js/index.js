import "uikit/dist/css/uikit.css";
import Vue from "vue";
import VueI18n from "vue-i18n";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import router from "../router";

UIkit.use(Icons);
Vue.use(VueI18n);

const i18n = new VueI18n({ locale: "zh-CN" });
new Vue({
    i18n,
    router
}).$mount("#app");
