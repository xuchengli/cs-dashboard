import Vue from "vue";
import VueRouter from "vue-router";
import Login from "./components/login.vue";
import Register from "./components/register.vue";
import Dashboard from "./components/dashboard.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { path: "/", component: Login },
        { path: "/register", component: Register },
        { path: "/dashboard", component: Dashboard }
    ]
});
export default router;
