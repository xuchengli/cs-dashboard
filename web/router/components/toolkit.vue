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
            "circle": "Circle",
            "ellipse": "Ellipse",
            "polygon": "Polygon",
            "curveSurface": "Curve surface"
        },
        "zh-CN": {
            "point": "点",
            "segment": "线段",
            "path": "折线",
            "curve": "曲线",
            "square": "正方形",
            "rectangle": "矩形",
            "triangle": "三角形",
            "circle": "圆形",
            "ellipse": "椭圆形",
            "polygon": "多边形",
            "curveSurface": "曲平面"
        }
    }
</i18n>
<template>
    <div class="uk-flex uk-flex-wrap uk-flex-wrap-around">
        <div class="uk-width-1-6 tool" v-for="tool of tools"
            uk-tooltip :title="$t(tool.name)">
            <icon :name="tool.name"></icon>
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
                    active: false
                });
            }
            return {
                tools: tools
            };
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
    .tool:hover {
        border: 1px solid #bbb;
        border-radius: 3px;
    }
</style>
