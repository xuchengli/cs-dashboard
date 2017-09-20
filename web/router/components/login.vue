<template>
    <div class="uk-card uk-card-default uk-width-large uk-align-center uk-margin-auto-vertical">
        <div class="uk-card-header">
            <h3 class="uk-card-title">Login</h3>
        </div>
        <div class="uk-card-body">
            <form>
                <div class="uk-margin">
                    <verifiable-input class="uk-width-1-1"
                        icon="user" placeholder="User ID" v-model="userId"
                        empty-message="Please input use id.">
                    </verifiable-input>
                </div>
                <div class="uk-margin">
                    <verifiable-input class="uk-width-1-1"
                        icon="lock" type="password" placeholder="Password" v-model="password"
                        empty-message="Please input password.">
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
                userId: "",
                password: "",
                checked: false
            }
        },
        computed: {
        },
        methods: {
            login() {
                console.log(this.userId, this.password);
                if (this.userId != "" && this.password != "") {

                }
            }
        },
        components: {
            VerifiableInput
        }
    }
</script>
