<i18n>
    {
        "en": {
            "s": "Second",
            "m": "Minute",
            "h": "Hour"
        },
        "zh-CN": {
            "s": "秒",
            "m": "分钟",
            "h": "小时"
        }
    }
</i18n>
<template>
    <div class="dashboard">
        <div class="timeline">
            <time-scale :scale-ratio="ratio" :scale-unit="unit" :time="time"></time-scale>
            <div class="reference-axis"></div>
        </div>
        <div class="time-scale-adjuster">
            <vue-slider width="100%" height="0" :dot-size="9" tooltip="hover"
                :lazy="true" :piecewise="true" v-model="value" :data="pieces"
                :piecewise-style="pieceStyle" :formatter="formatter"></vue-slider>
        </div>
    </div>
</template>
<script>
    import TimeScale from "../../components/time-scale.vue";
    import vueSlider from "vue-slider-component";

    export default {
        data() {
            return {
                pieces: ["1s", "30s", "1m", "30m", "1h", "12h", "24h"],
                value: "1m",
                pieceStyle: {
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    backgroundColor: "#666",
                    width: "6px",
                    height: "6px",
                    visibility: "visible"
                }
            }
        },
        computed: {
            ratio() {
                return parseInt(this.value, 10);
            },
            unit() {
                return this.value.substring(this.value.length - 1);
            },
            time() {
                return this.$store.state["video-current-time"];
            },
            formatter() {
                return this.ratio + " " + this.$t(this.unit);
            }
        },
        components: {
            TimeScale,
            vueSlider
        }
    }
</script>
<style scoped>
    .dashboard {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
    }
    .timeline {
        position: relative;
        width: 100%;
        height: 80%;
        overflow: hidden;
    }
    .time-scale-adjuster {
        display: flex;
        width: 100%;
        height: 20%;
        border-top: 1px solid #ddd;
        align-items: center;
    }
    .reference-axis {
        position: absolute;
        top: 0;
        border-left: 2px solid #fff;
        height: 100%;
        left: 50%;
        margin-left: -1px;
    }
</style>
