<template>
    <div>
        <div class="uk-flex" v-if="loading">
            <div class="uk-margin-auto uk-margin-auto-vertical" uk-spinner="ratio: .8"></div>
        </div>
        <ul class="uk-list" v-else>
            <li v-for="api of apis">
                <div class="uk-flex uk-flex-between uk-flex-middle">
                    <span>{{ api.name }}</span>
                    <a uk-icon="icon: plus-circle"></a>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loading: false,
                apis: []
            }
        },
        created() {
            this.getAPIs();
        },
        watch: {
            "$route": "getAPIs"
        },
        methods: {
            getAPIs() {
                this.loading = true;
            }
        }
    }
</script>
