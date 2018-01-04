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
            <time-scale :scale-ratio="ratio" :scale-unit="unit" :scale-pixel="scaleWidth"
                        :time="time"></time-scale>
            <time-elapse :scale-ratio="ratio" :scale-unit="unit" :scale-pixel="scaleWidth"
                        :time="elapse"></time-elapse>
            <div class="reference-axis uk-flex">
                <icon class="video-record">
                    <icon name="circle" scale="1.5" style="color: #fff;"></icon>
                    <icon name="video-camera" scale=".75"></icon>
                </icon>
            </div>
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
    import TimeElapse from "../../components/time-elapse.vue";
    import vueSlider from "vue-slider-component";
    import Icon from "vue-awesome/components/Icon.vue";
    import "vue-awesome/icons/circle";
    import "vue-awesome/icons/video-camera";

    export default {
        data() {
            return {
                scaleWidth: 20,
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
            elapse() {
                return this.$store.state["video-elapse-time"];
            },
            formatter() {
                return this.ratio + " " + this.$t(this.unit);
            }
        },
        components: {
            TimeScale,
            TimeElapse,
            vueSlider,
            Icon
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
    .video-record {
        cursor: pointer;
        margin-top: auto;
        margin-bottom: auto;
        margin-left: -11px;
    }
</style>
