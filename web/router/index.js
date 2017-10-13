import Vue from "vue";
import VueRouter from "vue-router";
import Login from "./components/login.vue";
import Register from "./components/register.vue";
import Dashboard from "./components/dashboard.vue";
import Header from "./components/frame/header.vue";
import Sidebar from "./components/frame/sidebar.vue";
import Home from "./components/content/home.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { name: "login", path: "/", component: Login },
        { name: "register", path: "/register", component: Register },
        {
            path: "/dashboard", component: Dashboard,
            children: [
                {
                    path: "",
                    components: {
                        header: Header,
                        sidebar: Sidebar,
                        default: Home
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
        next("/dashboard");
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
