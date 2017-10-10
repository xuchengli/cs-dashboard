<i18n>
    {
        "en": {
            "title": "Login",
            "userIdPlaceholder": "User ID",
            "passwordPlaceholder": "Password",
            "rememberme": "Remember me",
            "registerButton": "Register",
            "loginButton": "Login",
            "userIdWarning": "Please input use id.",
            "passwordWarning": "Please input password.",
            "error403": "User ID or Password Error."
        },
        "zh-CN": {
            "title": "登录",
            "userIdPlaceholder": "用户ID",
            "passwordPlaceholder": "密码",
            "rememberme": "记住我",
            "registerButton": "注册",
            "loginButton": "登录",
            "userIdWarning": "请输入用户ID！",
            "passwordWarning": "请输入用户密码！",
            "error403": "用户ID或者密码错误！"
        }
    }
</i18n>
<template>
    <div class="uk-card uk-card-default uk-width-large uk-align-center uk-margin-auto-vertical">
        <div class="uk-card-header">
            <h3 class="uk-card-title">{{ $t("title") }}</h3>
        </div>
        <div class="uk-card-body">
            <form>
                <div class="uk-margin">
                    <verifiable-input class="uk-width-1-1"
                        icon="user" :placeholder="$t('userIdPlaceholder')" v-model="userId.value"
                        :status.sync="userId.status" :message.sync="userId.message"
                        :disabled="loading" @blur="validateUserId">
                    </verifiable-input>
                </div>
                <div class="uk-margin">
                    <verifiable-input class="uk-width-1-1"
                        icon="lock" type="password"
                        :placeholder="$t('passwordPlaceholder')" v-model="password.value"
                        :status.sync="password.status" :message.sync="password.message"
                        :disabled="loading" @blur="validatePassword">
                    </verifiable-input>
                </div>
                <div class="uk-margin uk-margin-remove-bottom">
                    <label>
                        <input class="uk-checkbox" type="checkbox" v-model="rememberme"
                            :disabled="loading">
                        {{ $t("rememberme") }}
                    </label>
                </div>
            </form>
        </div>
        <div class="uk-card-footer">
            <router-link to="/register" tag="button" class="uk-button uk-button-default"
                :disabled="loading">
                {{ $t("registerButton") }}
            </router-link>
            <button class="uk-button uk-button-primary uk-align-right" :disabled="loading"
                @click="login">
                {{ $t("loginButton") }}
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
                    this.userId.message = this.$t("userIdWarning");
                    return false;
                }
                return true;
            },
            validatePassword() {
                if (this.password.value === "") {
                    this.password.status = "warning";
                    this.password.message = this.$t("passwordWarning");
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
                            UIkit.notification(this.$t("error403"), "danger");
                        } else if (err.response.status === 500) {
                            UIkit.notification(this.$t("global.error.500"), "danger");
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
