<template>
    <div class="timeline">
        <time-scale></time-scale>
        <div class="reference-axis"></div>
    </div>
</template>
<script>
    import TimeScale from "../../components/time-scale.vue";

    export default {
        components: {
            TimeScale
        }
    }
</script>
<style scoped>
    .timeline {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        overflow: hidden;
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
