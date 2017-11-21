<i18n>
    {
        "en": {
            "draw": "Draw",
            "modify": "Modify",
            "point": "Point",
            "segment": "Line segment",
            "path": "Polyline",
            "curve": "Curve",
            "square": "Square",
            "rectangle": "Rectangle",
            "triangle": "Triangle",
            "circle": "Circle",
            "ellipse": "Ellipse",
            "pentagon": "Pentagon",
            "hexagon": "Hexagon",
            "star": "Star",
            "explosion": "Explosion",
            "polygon": "Polygon",
            "curveSurface": "Curve surface",
            "translate": "Translate"
        },
        "zh-CN": {
            "draw": "绘图",
            "modify": "修图",
            "point": "点",
            "segment": "线段",
            "path": "折线",
            "curve": "曲线",
            "square": "正方形",
            "rectangle": "矩形",
            "triangle": "三角形",
            "circle": "圆形",
            "ellipse": "椭圆形",
            "pentagon": "五边形",
            "hexagon": "六边形",
            "star": "五角星",
            "explosion": "爆炸形",
            "polygon": "多边形",
            "curveSurface": "曲平面",
            "translate": "平移"
        }
    }
</i18n>
<template>
    <form>
        <fieldset class="toolkit-fieldset" v-for="(_tools, type) in toolMap">
            <legend class="uk-text-meta">{{ $t(type) }}</legend>
            <div class="uk-flex uk-flex-wrap uk-flex-wrap-around">
                <div class="uk-width-1-6 tool" :class="{ 'tool-active': tool.active }"
                    v-for="tool of _tools" uk-tooltip :title="$t(tool.name)"
                    @click="select(tool.name)">
                    <icon :name="tool.name" :scale="tool.scale"></icon>
                </div>
            </div>
        </fieldset>
    </form>
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
                    type: icons[icon].type,
                    scale: icons[icon].scale || 1,
                    active: false
                });
            }
            return {
                tools: tools
            };
        },
        computed: {
            toolMap() {
                return {
                    "draw": this.tools.filter(tool => tool.type === "draw"),
                    "modify": this.tools.filter(tool => tool.type === "modify")
                };
            }
        },
        methods: {
            select(toolName) {
                let selected = this.tools.find(tool => tool.active);
                if (selected) {
                    selected.active = false;
                    if (selected.name === toolName) {
                        this.$emit("select", "");
                        return;
                    }
                }
                this.tools.find(tool => tool.name === toolName).active = true;
                this.$emit("select", toolName);
            }
        },
        components: {
            Icon
        }
    }
</script>
<style scoped>
    .toolkit-fieldset {
        border: 1px solid #e5e5e5;
        border-radius: 3px;
        margin: 10px 0;
    }
    .toolkit-fieldset:first-of-type {
        margin-top: 0;
    }
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
