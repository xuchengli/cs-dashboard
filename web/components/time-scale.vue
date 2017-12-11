<template>
    <div class="uk-flex uk-flex-middle uk-height-1-1">
        <div class="scale" v-for="scale of scales"
            :style="{ height: scale.time % 5 === 0 ? '60%' : '30%', left: scale.distance + 'px' }">
            <span v-if="scale.label">{{ scale.label }}</span>
        </div>
    </div>
</template>
<script>
    import dateFormat from "dateformat";

    const PIXEL_PER_SCALE = 10;
    export default {
        props: {
            time: {
                type: Number,
                default: () => Date.now()
            },
            scaleRatio: {
                type: Number,
                default: 1
            },
            scaleUnit: {
                type: String,
                default: "m"
            }
        },
        data() {
            return {
                width: 0
            }
        },
        computed: {
            currentLeft() {
                let left = [];
                let t = this.time;
                if (this.scaleUnit === "m") {
                    if (this.scaleRatio === 1) {
                        left.push({
                            "time": this.M(t),
                            "distance": this.width / 2 - this.s(t) / 60 * PIXEL_PER_SCALE,
                            "label": this.M(t) % 5 === 0 ? this.HHMM(t) : ""
                        });
                        while (left[left.length - 1].distance >= 0) {
                            t -= 60000;
                            left.push({
                                "time": this.M(t),
                                "distance": left[left.length - 1].distance - PIXEL_PER_SCALE,
                                "label": this.M(t) % 5 === 0 ? this.HHMM(t) : ""
                            });
                        }
                    } else {

                    }
                }
                return left;
            },
            currentRight() {
                let right = [];
                let t = this.time;
                if (this.scaleUnit === "m") {
                    if (this.scaleRatio === 1) {
                        t += 60000;
                        right.push({
                            "time": this.M(t),
                            "distance": this.width / 2 + (1 - this.s(t) / 60) * PIXEL_PER_SCALE,
                            "label": this.M(t) % 5 === 0 ? this.HHMM(t) : ""
                        });
                        while (right[right.length - 1].distance <= this.width) {
                            t += 60000;
                            right.push({
                                "time": this.M(t),
                                "distance": right[right.length - 1].distance + PIXEL_PER_SCALE,
                                "label": this.M(t) % 5 === 0 ? this.HHMM(t) : ""
                            });
                        }
                    } else {

                    }
                }
                return right;
            },
            scales() {
                return this.currentLeft.concat(this.currentRight);
            }
        },
        methods: {
            M(time) {
                return dateFormat(time, "M");
            },
            s(time) {
                return dateFormat(time, "s");
            },
            HHMM(time) {
                return dateFormat(time, "HH:MM");
            }
        },
        mounted() {
            this.width = this.$el.offsetWidth;
        }
    }
</script>
<style scoped>
    .scale {
        position: absolute;
        border-left: 1px solid #bbb;
    }
    .scale span {
        position: absolute;
        left: 2px;
        bottom: -10px;
        font-size: 10px;
        color: #bbb;
    }
</style>
