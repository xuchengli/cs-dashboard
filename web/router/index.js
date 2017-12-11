import Vue from "vue";
import VueRouter from "vue-router";
import Login from "./components/login.vue";
import Register from "./components/register.vue";
import Header from "./components/header.vue";
import Videos from "./components/videos.vue";
import Workbench from "./components/workbench.vue";
import Toolkit from "./components/toolkit.vue";
import APIList from "./components/api-list.vue";
import VideoPlayer from "./components/video-player.vue";
import TimeLine from "./components/timeline.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { name: "login", path: "/", component: Login },
        { name: "register", path: "/register", component: Register },
        {
            path: "/videos", component: Videos,
            children: [
                { path: "", component: Header }
            ],
            meta: { requiresAuth: true }
        },
        {
            path: "/video/:id", component: Workbench, props: true,
            children: [
                {
                    path: "",
                    components: {
                        "default": Header,
                        "toolkit": Toolkit,
                        "api-list": APIList,
                        "video-player": VideoPlayer,
                        "timeline": TimeLine
                    }
                }
            ],
            meta: { requiresAuth: true }
        }
    ]
});
router.beforeEach((to, from, next) => {
    let account = Vue.cookie.get("csda");
    let redirect = Vue.cookie.get("redirect");
    if (to.name === "login" && account) {
        next("/videos");
    } else if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!account) {
            Vue.cookie.set("redirect", to.fullPath);
            next("/");
        } else if (redirect) {
            Vue.cookie.delete("redirect");
            next(redirect);
        } else {
            next();
        }
    } else {
        next();
    }
});
export default router;
