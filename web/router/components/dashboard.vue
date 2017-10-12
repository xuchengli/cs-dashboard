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
    <div class="uk-container uk-width-1-1 uk-padding-remove">
        <nav class="uk-navbar-container uk-margin" uk-navbar>
            <div class="uk-navbar-left">
                <div class="uk-navbar-item">
                    <span class="uk-text-large">{{ $t("title") }}</span>
                </div>
            </div>
            <div class="uk-navbar-right uk-margin-medium-right">
                <div class="uk-navbar-item uk-flex-column uk-flex-bottom">
                    <span>{{ normalizedUserId }}</span>
                    <router-link to="/" @click.native="logout">
                        {{ $t("logout") }}
                    </router-link>
                </div>
            </div>
        </nav>
        <div uk-grid>
        </div>
    </div>
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
            this.userId = account["username"];
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
            }
        }
    }
</script>
