<i18n>
    {
        "en": {
            "title": "Register",
            "userIdPlaceholder": "User ID",
            "passwordPlaceholder": "Password",
            "retypePasswordPlaceholder": "Retype password",
            "registerButton": "Register",
            "userIdWarning": "Please input use id.",
            "passwordWarning": "Please input password.",
            "retypePasswordWarning": "Please retype password.",
            "confirmPasswordWarning": "Please confirm password.",
            "error409": "User ID already registered."
        },
        "zh-CN": {
            "title": "注册",
            "userIdPlaceholder": "用户ID",
            "passwordPlaceholder": "密码",
            "retypePasswordPlaceholder": "再次输入密码",
            "registerButton": "注册",
            "userIdWarning": "请输入用户ID！",
            "passwordWarning": "请输入用户密码！",
            "retypePasswordWarning": "请再次输入用户密码！",
            "confirmPasswordWarning": "请确认用户密码是否一致！",
            "error409": "用户ID已经被注册！"
        }
    }
</i18n>
<template>
    <div class="uk-card uk-card-default uk-width-large uk-align-center uk-margin-auto-vertical">
        <div class="uk-card-header">
            <h3 class="uk-card-title">
                <router-link to="/" uk-icon="icon: arrow-left; ratio: 1.5"
                    :event="loading ? '' : 'click'"></router-link>
                {{ $t("title") }}
            </h3>
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
                        icon="lock" type="password" :placeholder="$t('passwordPlaceholder')"
                        v-model="password.value"
                        :status.sync="password.status" :message.sync="password.message"
                        :disabled="loading" @blur="validatePassword">
                    </verifiable-input>
                </div>
                <div class="uk-margin uk-margin-remove-bottom">
                    <verifiable-input class="uk-width-1-1"
                        icon="lock" type="password" :placeholder="$t('retypePasswordPlaceholder')"
                        v-model="retypePassword.value"
                        :status.sync="retypePassword.status" :message.sync="retypePassword.message"
                        :disabled="loading" @blur="validateRetypePassword">
                    </verifiable-input>
                </div>
            </form>
        </div>
        <div class="uk-card-footer">
            <button class="uk-button uk-button-primary uk-align-right" :disabled="loading"
                @click="register">
                {{ $t("registerButton") }}
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
                retypePassword: {
                    value: "",
                    status: "normal",
                    message: ""
                },
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
            confirm(pwd1, pwd2) {
                if (pwd1.value != "" && pwd2.value != "" && pwd1.value != pwd2.value) {
                    pwd1.status = "warning";
                    pwd1.message = this.$t("confirmPasswordWarning");
                    pwd2.status = "normal";
                    pwd2.message = "";
                    return false;
                } else {
                    pwd1.status = "normal";
                    pwd1.message = "";
                    pwd2.status = "normal";
                    pwd2.message = "";
                    return true;
                }
            },
            validatePassword() {
                if (this.password.value === "") {
                    this.password.status = "warning";
                    this.password.message = this.$t("passwordWarning");
                    return false;
                }
                return this.confirm(this.password, this.retypePassword);
            },
            validateRetypePassword() {
                if (this.retypePassword.value === "") {
                    this.retypePassword.status = "warning";
                    this.retypePassword.message = this.$t("retypePasswordWarning");
                    return false;
                }
                return this.confirm(this.retypePassword, this.password);
            },
            register() {
                if (this.userId.message != "" || this.password.message != "" ||
                    this.retypePassword.message != "") return;
                if (this.validateUserId() && this.validatePassword() &&
                    this.validateRetypePassword()) {
                    this.loading = true;
                    axios.post("api/register", {
                        userId: this.userId.value,
                        password: this.password.value
                    }).then(res => {
                        this.loading = false;
                        console.log(res.data);
                    }).catch(err => {
                        this.loading = false;
                        if (err.response.status === 409) {
                            this.userId.status = "error";
                            this.userId.message = this.$t("error409");
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
