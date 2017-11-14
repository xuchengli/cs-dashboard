<template>
    <div class="uk-flex uk-flex-wrap uk-flex-wrap-around">
        <div class="uk-width-1-6 tool" v-for="tool of tools">
            <icon :name="tool.name"></icon>
        </div>
    </div>
</template>
<script>
    import Icon from "vue-awesome/components/Icon.vue";
    import icons from "../../js/icons";

    Icon.register(icons);

    export default {
        data() {
            let tools = [];
            for (let icon in icons) {
                tools.push({
                    name: icon,
                    active: false
                });
            }
            return {
                tools: tools
            };
        },
        components: {
            Icon
        }
    }
</script>
<style scoped>
    .tool {
        cursor: pointer;
        text-align: center;
        width: 28px;
        height: 28px;
    }
    .tool:hover {
        border: 1px solid #bbb;
        border-radius: 3px;
    }
</style>
