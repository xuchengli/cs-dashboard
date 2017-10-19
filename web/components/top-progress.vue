<template>
    <div class="progress" :style="style"></div>
</template>
<script>
    export default {
        props: {
            percentage: {
                type: Number,
                default: 0
            }
        },
        computed: {
            opacity() {
                return this.percentage > 0 && this.percentage < 100 ? 1 : 0;
            },
            style() {
                return {
                    width: this.percentage + "%",
                    opacity: this.opacity
                }
            }
        }
    }
</script>
<style scoped>
    .progress {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 0px;
        height: 2px;
        opacity: 0;
        background: rgba(30, 135, 240, 0.8);
        box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
        -webkit-transition: opacity 0.6s ease;
        transition: opacity 0.6s ease;
        z-index: 1000;
    }
</style>
