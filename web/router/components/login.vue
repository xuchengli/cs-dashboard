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
                </div>
                <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: lock"></span>
                        <input class="uk-input" type="password" placeholder="Password"
                            :class="passwordClass" v-model="password"
                            @focus="passwordActive = true" @blur="passwordActive = false">
                    </div>
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
            userIdClass() {
                return this.userIdActive ? "" : this.userId === "" ? "uk-form-danger" : "";
            },
            passwordClass() {
                return this.passwordActive ? "" : this.password === "" ? "uk-form-danger" : "";
            }
        },
        methods: {
            login() {
                console.log(this.userId, this.password, this.checked);
            }
        }
    }
</script>
