<i18n>
    {
        "en": {
            "point": "Point",
            "segment": "Line segment",
            "path": "Polyline",
            "curve": "Curve",
            "square": "Square",
            "rectangle": "Rectangle",
            "triangle": "Triangle",
            "round": "Circle",
            "ellipse": "Ellipse",
            "pentagon": "Pentagon",
            "hexagon": "Hexagon",
            "star": "Star",
            "explosion": "Explosion",
            "polygon": "Polygon",
            "curveSurface": "Curve surface",
            "transform": "Transform",
            "modify": "Modify"
        },
        "zh-CN": {
            "point": "点",
            "segment": "线段",
            "path": "折线",
            "curve": "曲线",
            "square": "正方形",
            "rectangle": "矩形",
            "triangle": "三角形",
            "round": "圆形",
            "ellipse": "椭圆形",
            "pentagon": "五边形",
            "hexagon": "六边形",
            "star": "五角星",
            "explosion": "爆炸形",
            "polygon": "多边形",
            "curveSurface": "曲平面",
            "transform": "编辑",
            "modify": "变形"
        }
    }
</i18n>
<template>
    <div class="uk-flex uk-flex-wrap uk-flex-wrap-around">
        <div class="uk-width-1-6 tool" :class="{ 'tool-active': tool.active }"
            v-for="tool of tools" uk-tooltip :title="$t(tool.name)"
            @click="select(tool.name)">
            <icon :name="tool.name" :scale="tool.scale"></icon>
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
                    scale: icons[icon].scale || 1,
                    active: false
                });
            }
            return {
                tools: tools
            };
        },
        computed: {
            videoPlay() {
                return this.$store.state["video-play"];
            }
        },
        methods: {
            select(toolName) {
                if (!this.videoPlay) return;
                let selected = this.tools.find(tool => tool.active);
                if (selected) {
                    selected.active = false;
                    if (selected.name === toolName) {
                        this.$store.commit("selectTool", { name: "" });
                        return;
                    }
                }
                this.tools.find(tool => tool.name === toolName).active = true;
                this.$store.commit("selectTool", { name: toolName });
            }
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
    .tool:hover:not(.tool-active) {
        border: 1px solid #bbb;
        border-radius: 3px;
    }
    .tool-active {
        border: 1px solid #bbb;
        border-radius: 3px;
        background-color: #f2f2f2;
    }
</style>
