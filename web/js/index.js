import "uikit/dist/css/uikit.css";
import Vue from "vue";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import router from "../router";

UIkit.use(Icons);

new Vue({
    router
}).$mount("#app");
