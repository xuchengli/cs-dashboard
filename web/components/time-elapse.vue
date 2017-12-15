<template>
    <div class="elapse" :style="style"></div>
</template>
<script>
    export default {
        props: {
            time: {
                type: Number,
                default: 0
            },
            scaleRatio: {
                type: Number,
                default: 1
            },
            scaleUnit: {
                type: String,
                default: "m"
            },
            scalePixel: {
                type: Number,
                default: 20
            }
        },
        data() {
            return {
                left: 0
            }
        },
        computed: {
            width() {
                let _width = 0;
                if (this.scaleUnit === "h") {
                    _width = this.time / (this.scaleRatio * 3600) * this.scalePixel;
                } else if (this.scaleUnit === "m") {
                    _width = this.time / (this.scaleRatio * 60) * this.scalePixel;
                } else if (this.scaleUnit === "s") {
                    _width = this.time / this.scaleRatio * this.scalePixel;
                }
                return _width;
            },
            style() {
                return {
                    left: (this.left - this.width) + "px",
                    width: this.width + "px"
                }
            }
        },
        mounted() {
            this.left = this.$el.parentNode.offsetWidth / 2;
        }
    }
</script>
<style scoped>
    .elapse {
        position: absolute;
        top: 0;
        height: 100%;
        background-color: rgba(250, 170, 108, 0.5);
    }
</style>
