import Vue from "vue";
import VueRouter from "vue-router";
import Login from "./components/login.vue";
import Register from "./components/register.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { path: "/", component: Login },
        { path: "/register", component: Register }
    ]
});
export default router;
