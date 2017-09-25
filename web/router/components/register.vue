<template>
    <div class="uk-card uk-card-default uk-width-large uk-align-center uk-margin-auto-vertical">
        <div class="uk-card-header">
            <h3 class="uk-card-title">
                <router-link to="/" uk-icon="icon: arrow-left; ratio: 1.5"></router-link>
                Register
            </h3>
        </div>
        <div class="uk-card-body">
            <form>
                <div class="uk-margin">
                    <verifiable-input class="uk-width-1-1"
                        icon="user" placeholder="User ID" v-model="userId.value"
                        :status.sync="userId.status" :message.sync="userId.message"
                        @blur="validateUserId">
                    </verifiable-input>
                </div>
                <div class="uk-margin">
                    <verifiable-input class="uk-width-1-1"
                        icon="lock" type="password" placeholder="Password"
                        v-model="password.value"
                        :status.sync="password.status" :message.sync="password.message"
                        @blur="validatePassword">
                    </verifiable-input>
                </div>
                <div class="uk-margin uk-margin-remove-bottom">
                    <verifiable-input class="uk-width-1-1"
                        icon="lock" type="password" placeholder="Retype password"
                        v-model="retypePassword.value"
                        :status.sync="retypePassword.status" :message.sync="retypePassword.message"
                        @blur="validateRetypePassword">
                    </verifiable-input>
                </div>
            </form>
        </div>
        <div class="uk-card-footer">
            <button class="uk-button uk-button-primary uk-align-right" @click="register">
                Register
            </button>
        </div>
    </div>
</template>
<script>
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
                }
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
            validateRetypePassword() {
                if (this.retypePassword.value === "") {
                    this.retypePassword.status = "warning";
                    this.retypePassword.message = "Please retype password.";
                    return false;
                } else if (this.retypePassword.value != this.password.value) {
                    this.retypePassword.status = "warning";
                    this.retypePassword.message = "Please confirm password.";
                    return false;
                }
                return true;
            },
            register() {
                if (this.validateUserId() && this.validatePassword() && this.validateRetypePassword()) {
                    console.log(this.userId.value, this.password.value);
                }
            }
        },
        components: {
            VerifiableInput
        }
    }
</script>
