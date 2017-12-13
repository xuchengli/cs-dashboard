<template>
    <div class="uk-flex uk-flex-middle uk-height-1-1">
        <div class="scale" v-for="scale of scales"
            :style="{ height: scale.label ? '60%' : '30%', left: scale.distance + 'px' }">
            <span class="uk-text-nowrap" v-if="scale.label">{{ scale.label }}</span>
        </div>
    </div>
</template>
<script>
    import dateFormat from "dateformat";

    const PIXEL_PER_SCALE = 20;
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
            scales() {
                let scales = [];
                let t = this.time;
                //找到基准时间，中间线左边或者右边，基准时间是整点
                if (this.scaleUnit === "h") {
                    let hour = this.H(t);
                    let min = hour <= 12 ? -(hour * 60 + this.M(t)) : 24 * 60 - (hour * 60 + this.M(t));
                    t += min * 60000;
                    scales.push({
                        "time": t,
                        "distance": this.width / 2 + min / (this.scaleRatio * 60) * PIXEL_PER_SCALE,
                        "label": this.mdh(t)
                    });
                } else if (this.scaleUnit === "m") {
                    let min = this.M(t);
                    let sec = min <= 30 ? -(min * 60 + this.s(t)) : 3600 - (min * 60 + this.s(t));
                    t += sec * 1000;
                    scales.push({
                        "time": t,
                        "distance": this.width / 2 + sec / (this.scaleRatio * 60) * PIXEL_PER_SCALE,
                        "label": this.HHMM(t)
                    });
                } else if (this.scaleUnit === "s") {
                    let sec = this.s(t);
                    let ms = sec <= 30 ? -(sec * 1000 + this.ms(t)) : 60000 - (sec * 1000 + this.ms(t));
                    t += ms;
                    scales.push({
                        "time": t,
                        "distance": this.width / 2 + ms / (this.scaleRatio * 1000) * PIXEL_PER_SCALE,
                        "label": this.HHMMss(t)
                    });
                }
                //根据基准时间向左右延展
                this.scaleExtend(scales, t, this.scaleUnit);
                return scales;
            }
        },
        methods: {
            H(time) {
                return new Date(time).getHours();
            },
            M(time) {
                return new Date(time).getMinutes();
            },
            s(time) {
                return new Date(time).getSeconds();
            },
            ms(time) {
                return new Date(time).getMilliseconds();
            },
            HHMM(time) {
                return dateFormat(time, "HH:MM");
            },
            HHMMss(time) {
                return dateFormat(time, "HH:MM:ss");
            },
            mdh(time) {
                return dateFormat(time, "m-d, h TT");
            },
            scaleExtend(scales, time, unit) {
                //基准时间向右延展
                let rt = time, label = "", i = 0;
                while (scales[scales.length - 1].distance < this.width) {
                    switch(unit) {
                        case "h":
                            rt += this.scaleRatio * 3600000;
                            label = (++i) % 5 === 0 ? this.mdh(rt) : "";
                            break;
                        case "m":
                            rt += this.scaleRatio * 60000;
                            label = (++i) % 5 === 0 ? this.HHMM(rt) : "";
                            break;
                        case "s":
                            rt += this.scaleRatio * 1000;
                            label = (++i) % 5 === 0 ? this.HHMMss(rt) : "";
                            break;
                    }
                    scales.push({
                        "time": rt,
                        "distance": scales[scales.length - 1].distance + PIXEL_PER_SCALE,
                        "label": label
                    });
                }
                //基准时间向左延展
                let lt = time; i = 0;
                while (scales[0].distance > 0) {
                    switch(unit) {
                        case "h":
                            lt -= this.scaleRatio * 3600000;
                            label = (++i) % 5 === 0 ? this.mdh(lt) : "";
                            break;
                        case "m":
                            lt -= this.scaleRatio * 60000;
                            label = (++i) % 5 === 0 ? this.HHMM(lt) : "";
                            break;
                        case "s":
                            lt -= this.scaleRatio * 1000;
                            label = (++i) % 5 === 0 ? this.HHMMss(lt) : "";
                            break;
                    }
                    scales.unshift({
                        "time": lt,
                        "distance": scales[0].distance - PIXEL_PER_SCALE,
                        "label": label
                    });
                }
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
