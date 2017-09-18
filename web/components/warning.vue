<template>
    <div class="warning" :style="style">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                top: 0,
                left: 0,
                width: "auto",
                height: "auto"
            }
        },
        computed: {
            style() {
                return {
                    top: this.top + "px",
                    left: this.left + "px",
                    width: isNaN(this.width) ? this.width : this.width + "px",
                    height: isNaN(this.height) ? this.height : this.height + "px"
                }
            }
        },
        mounted() {
            let style = window.getComputedStyle(this.$el, null);
            let positionedRect = this.$el.offsetParent.getBoundingClientRect();
            let previousSiblingRect = this.$el.previousElementSibling.getBoundingClientRect();
            this.width = parseFloat(style.getPropertyValue("width"));
            this.height = parseFloat(style.getPropertyValue("height"));
            this.left = previousSiblingRect.left - positionedRect.left + previousSiblingRect.width + 10;
            this.top = previousSiblingRect.top - positionedRect.top + (previousSiblingRect.height - this.height) / 2;
        }
    }
</script>
<style scoped>
    .warning {
        position: absolute;
        z-index: 1000;
        box-sizing: border-box;
        padding: 3px 6px;
        background: #faa05a;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
    }
</style>
