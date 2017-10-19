<i18n>
    {
        "en": {
            "title": "Cognitive Solution Dashboard",
            "logout": "Logout"
        },
        "zh-CN": {
            "title": "认知解决方案操作面板",
            "logout": "退出"
        }
    }
</i18n>
<template>
    <nav class="uk-navbar-container uk-margin uk-margin-remove-top" uk-navbar>
        <div class="uk-navbar-left">
            <div class="uk-navbar-item">
                <span class="uk-text-large">{{ $t("title") }}</span>
            </div>
        </div>
        <div class="uk-navbar-right uk-margin-medium-right">
            <div class="uk-navbar-item uk-flex-column uk-flex-bottom">
                <span>{{ normalizedUserId }}</span>
                <a @click="logout">{{ $t("logout") }}</a>
            </div>
        </div>
    </nav>
</template>
<script>
    export default {
        data() {
            return {
                userId: ""
            }
        },
        created() {
            let account = JSON.parse(this.$cookie.get("csda"));
            if (account) this.userId = account["username"];
        },
        computed: {
            normalizedUserId() {
                let idx = this.userId.lastIndexOf("@");
                return idx >= 0 ? this.userId.substring(0, idx) : this.userId;
            }
        },
        methods: {
            logout() {
                this.$cookie.delete("csda");
                this.$router.push("/");
            }
        }
    }
</script>
