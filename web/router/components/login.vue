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
                        @blur="validateUserId">
                    </verifiable-input>
                </div>
                <div class="uk-margin">
                    <verifiable-input class="uk-width-1-1"
                        icon="lock" type="password" placeholder="Password" v-model="password.value"
                        :status.sync="password.status" :message.sync="password.message"
                        @blur="validatePassword">
                    </verifiable-input>
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
                checked: false
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
                if (this.validateUserId() && this.validatePassword()) {
                    console.log(this.userId.value, this.password.value);
                }
            }
        },
        components: {
            VerifiableInput
        }
    }
</script>
