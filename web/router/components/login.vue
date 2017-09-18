<template>
    <div class="uk-card uk-card-default uk-width-large uk-align-center uk-margin-auto-vertical">
        <div class="uk-card-header">
            <h3 class="uk-card-title">Login</h3>
        </div>
        <div class="uk-card-body">
            <form>
                <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: user"></span>
                        <input class="uk-input" type="text" placeholder="User ID"
                            :class="userIdClass" v-model="userId"
                            @focus="userIdActive = true" @blur="userIdActive = false">
                    </div>
                    <transition name="slide-fade">
                        <warning v-if="userIdWarning">
                            Please input use id.
                        </warning>
                    </transition>
                </div>
                <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: lock"></span>
                        <input class="uk-input" type="password" placeholder="Password"
                            :class="passwordClass" v-model="password"
                            @focus="passwordActive = true" @blur="passwordActive = false">
                    </div>
                    <transition name="slide-fade">
                        <warning v-if="passwordWarning">
                            Please input password.
                        </warning>
                    </transition>
                </div>
                <div class="uk-margin uk-margin-remove-bottom">
                    <label>
                        <input class="uk-checkbox" type="checkbox" v-model="checked">
                        Remember me
                    </label>
                </div>
            </form>
        </div>
        <div class="uk-card-footer">
            <router-link to="/register" class="uk-button uk-button-default">Register</router-link>
            <button class="uk-button uk-button-primary uk-align-right" @click="login">Login</button>
        </div>
    </div>
</template>
<script>
    import warning from "../../components/warning.vue";

    export default {
        data() {
            return {
                userId: "",
                password: "",
                checked: false,
                userIdActive: true,
                passwordActive: true
            }
        },
        computed: {
            userIdWarning() {
                return !this.userIdActive && this.userId === "";
            },
            userIdClass() {
                return this.userIdWarning ? "uk-form-danger" : "";
            },
            passwordWarning() {
                return !this.passwordActive && this.password === "";
            },
            passwordClass() {
                return this.passwordWarning ? "uk-form-danger" : "";
            }
        },
        methods: {
            login() {
                if (this.userId != "" && this.password != "") {

                }
            }
        },
        components: {
            warning
        }
    }
</script>
<style scoped>
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateY(-50px);
        opacity: 0;
    }
    .slide-fade-enter-active, .slide-fade-leave-active {
        transition: transform .5s, opacity .5s;
    }
</style>
