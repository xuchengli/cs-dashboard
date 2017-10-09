<template>
    <div class="uk-card uk-card-default uk-width-large uk-align-center uk-margin-auto-vertical">
        <div class="uk-card-header">
            <h3 class="uk-card-title">Login</h3>
        </div>
        <div class="uk-card-body">
            <form>
                <div class="uk-margin">
                    <verifiable-input class="uk-width-1-1"
                        icon="user" placeholder="User ID" v-model="userId.value"
                        :status.sync="userId.status" :message.sync="userId.message"
                        :disabled="loading" @blur="validateUserId">
                    </verifiable-input>
                </div>
                <div class="uk-margin">
                    <verifiable-input class="uk-width-1-1"
                        icon="lock" type="password" placeholder="Password" v-model="password.value"
                        :status.sync="password.status" :message.sync="password.message"
                        :disabled="loading" @blur="validatePassword">
                    </verifiable-input>
                </div>
                <div class="uk-margin uk-margin-remove-bottom">
                    <label>
                        <input class="uk-checkbox" type="checkbox" v-model="rememberme"
                            :disabled="loading">
                        Remember me
                    </label>
                </div>
            </form>
        </div>
        <div class="uk-card-footer">
            <router-link to="/register" tag="button" class="uk-button uk-button-default"
                :disabled="loading">
                Register
            </router-link>
            <button class="uk-button uk-button-primary uk-align-right" :disabled="loading"
                @click="login">
                Login
                <div uk-spinner="ratio: .6" style="margin-left:5px;" v-if="loading"></div>
            </button>
        </div>
    </div>
</template>
<script>
    import UIkit from "uikit";
    import axios from "axios";
    import VerifiableInput from "../../components/verifiable-input.vue";

    export default {
        data() {
            return {
                userId: {
                    value: "",
                    status: "normal",
                    message: ""
                },
                password: {
                    value: "",
                    status: "normal",
                    message: ""
                },
                rememberme: false,
                loading: false
            }
        },
        methods: {
            validateUserId() {
                if (this.userId.value === "") {
                    this.userId.status = "warning";
                    this.userId.message = "Please input use id.";
                    return false;
                }
                return true;
            },
            validatePassword() {
                if (this.password.value === "") {
                    this.password.status = "warning";
                    this.password.message = "Please input password.";
                    return false;
                }
                return true;
            },
            login() {
                if (this.userId.message != "" || this.password.message != "") return;
                if (this.validateUserId() && this.validatePassword()) {
                    this.loading = true;
                    axios.post("api/login", {
                        userId: this.userId.value,
                        password: this.password.value,
                        rememberme: this.rememberme
                    }).then(res => {
                        this.loading = false;
                        console.log(res.data);
                    }).catch(err => {
                        this.loading = false;
                        if (err.response.status === 403) {
                            UIkit.notification("User ID or Password Error", "danger");
                        } else if (err.response.status === 500) {
                            UIkit.notification("Internal Server Error", "danger");
                        }
                    });
                }
            }
        },
        components: {
            VerifiableInput
        }
    }
</script>
