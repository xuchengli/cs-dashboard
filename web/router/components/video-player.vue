<template>
    <div class="player">
        <div id="video-canvas" class="uk-width-1-1 uk-height-1-1"></div>
        <div class="uk-flex overlayer" v-if="loading">
            <div class="uk-margin-auto uk-margin-auto-vertical" uk-spinner></div>
        </div>
    </div>
</template>
<script>
    import UIkit from "uikit";
    import axios from "axios";
    import JSMpeg from "@lixuc/jsmpeg";
    import Map from "ol/map";
    import View from "ol/view";
    import Projection from "ol/proj/projection";
    import Interaction from "ol/interaction";
    import ImageLayer from "ol/layer/image";
    import ImageCanvas from "ol/source/imagecanvas";
    import VectorLayer from "ol/layer/vector";
    import VectorSource from "ol/source/vector";
    import Style from "ol/style/style";
    import Fill from "ol/style/fill";
    import Stroke from "ol/style/stroke";
    import Circle from "ol/style/circle";
    import Draw from "ol/interaction/draw";
    import Select from "ol/interaction/select";
    import DragBox from "ol/interaction/dragbox";
    import Translate from "ol/interaction/translate";
    import Polygon from "ol/geom/polygon";

    export default {
        props: ["src", "handle"],
        data() {
            return {
                loading: false,
                player: null,
                video: null,
                map: null,
                context: null,
                center: [0, 0],
                dx: 0,
                dy: 0,
                vectorSource: null,
                interactions: []
            }
        },
        mounted() {
            this.init();
        },
        watch: {
            "$route": "init",
            "video.currentFrame": function(frame) {
                if (frame > 0) {
                    if (frame === 1) {
                        let videoLayer = new ImageLayer({
                            source: new ImageCanvas({
                                canvasFunction: (extent, resolution, pixelRatio,
                                    size, projection) => {
                                    let center = this.map.getView().getCenter();
                                    let canvas = document.createElement("canvas");
                                    this.context = canvas.getContext("2d");
                                    canvas.setAttribute("width", size[0]);
                                    canvas.setAttribute("height", size[1]);

                                    this.dx += this.center[0] - center[0];
                                    this.dy += center[1] - this.center[1];

                                    this.center = center;

                                    this.context.putImageData(this.video.destination.imageData,
                                        this.dx, this.dy);
                                    return canvas;
                                },
                                ratio: 1,
                                resolutions: [1]
                            })
                        });
                        this.vectorSource = new VectorSource({
                            wrapX: false
                        });
                        this.map.addLayer(videoLayer);
                        this.map.addLayer(new VectorLayer({
                            source: this.vectorSource,
                            style: new Style({
                                fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
                                stroke: new Stroke({
                                    color: "#3399cc",
                                    width: 3
                                }),
                                image: new Circle({
                                    radius: 7,
                                    fill: new Fill({ color: "#3399cc" })
                                })
                            })
                        }));
                        this.loading = false;
                    } else {
                        this.context.putImageData(this.video.destination.imageData, this.dx, this.dy);
                        this.map.render();
                    }
                }
            },
            handle: function(h) {
                while (this.interactions.length) {
                    this.map.removeInteraction(this.interactions.pop());
                }
                let draw = null, select = null, dragBox = null, translate = null;
                switch(h) {
                    case "point":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Point"
                        });
                        break;
                    case "segment":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "LineString",
                            maxPoints: 2
                        });
                        break;
                    case "path":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "LineString",
                            freehandCondition: () => false
                        });
                        break;
                    case "curve":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "LineString",
                            freehand: true
                        });
                        break;
                    case "square":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Circle",
                            geometryFunction: Draw.createRegularPolygon(4)
                        });
                        break;
                    case "rectangle":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Circle",
                            geometryFunction: Draw.createBox()
                        });
                        break;
                    case "triangle":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Circle",
                            geometryFunction: Draw.createRegularPolygon(3)
                        });
                        break;
                    case "circle":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Circle",
                            geometryFunction: Draw.createRegularPolygon(60)
                        });
                        break;
                    case "ellipse":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Circle",
                            geometryFunction: (coordinates, geometry) => {
                                if (!geometry) geometry = new Polygon(null);
                                let center = coordinates[0];
                                let last = coordinates[1];
                                let dx = center[0] - last[0];
                                let dy = center[1] - last[1];
                                let rotation = Math.atan2(dy, dx);
                                let radius1 = Math.sqrt(dx * dx + dy * dy);
                                let radius2 = radius1 / 2;
                                let newCoordinates = [];
                                let numPoints = 60;
                                for (let i=0; i<numPoints; i++) {
                                    let angle = i * 2 * Math.PI / numPoints;
                                    let cosAngle = Math.cos(angle);
                                    let offsetX = radius1 * cosAngle;
                                    let offsetY = radius2 * Math.sqrt(1 - cosAngle * cosAngle);
                                    if (angle > Math.PI) offsetY *= -1;
                                    newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
                                }
                                newCoordinates.push(newCoordinates[0].slice());
                                geometry.setCoordinates([newCoordinates]);
                                geometry.rotate(rotation, center);
                                return geometry;
                            }
                        });
                        break;
                    case "pentagon":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Circle",
                            geometryFunction: Draw.createRegularPolygon(5)
                        });
                        break;
                    case "hexagon":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Circle",
                            geometryFunction: Draw.createRegularPolygon(6)
                        });
                        break;
                    case "star":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Circle",
                            geometryFunction: (coordinates, geometry) => {
                                return this.createStar(coordinates, geometry, 10);
                            }
                        });
                        break;
                    case "explosion":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Circle",
                            geometryFunction: (coordinates, geometry) => {
                                return this.createStar(coordinates, geometry, 16);
                            }
                        });
                        break;
                    case "polygon":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Polygon",
                            freehandCondition: () => false
                        });
                        break;
                    case "curveSurface":
                        draw = new Draw({
                            source: this.vectorSource,
                            type: "Polygon",
                            freehand: true
                        });
                        break;
                    case "translate":
                        select = new Select();
                        this.interactions.push(select);
                        this.map.addInteraction(select);

                        let selectedFeatures = select.getFeatures();

                        dragBox = new DragBox();
                        this.interactions.push(dragBox);
                        this.map.addInteraction(dragBox);
                        dragBox.on("boxstart", () => { selectedFeatures.clear(); });
                        dragBox.on("boxend", () => {
                            let extent = dragBox.getGeometry().getExtent();
                            this.vectorSource.forEachFeatureIntersectingExtent(extent, feature => {
                                selectedFeatures.push(feature);
                            });
                        });

                        translate = new Translate({ features: selectedFeatures });
                        this.interactions.push(translate);
                        this.map.addInteraction(translate);
                        break;
                }
                if (draw) {
                    draw.on("drawend", evt => {
                        console.info(evt.feature.getGeometry().getType());
                        console.log(evt.feature.getGeometry().getCoordinates());
                    });
                    this.interactions.push(draw);
                    this.map.addInteraction(draw);
                }
            }
        },
        methods: {
            init() {
                this.loading = true;
                this.player = new JSMpeg.Player(this.src, {
                    disableGl: true,
                    silence: true
                });
                this.video = this.player.video;
                this.map = new Map({
                    target: "video-canvas",
                    pixelRatio: 1,
                    layers: [],
                    controls: [],
                    interactions: Interaction.defaults({
                        altShiftDragRotate: false,
                        keyboard: false,
                        shiftDragZoom: false,
                        pinchRotate: false
                    }),
                    logo: false,
                    view: new View({
                        projection: new Projection({
                            code: "video-image",
                            units: "pixels"
                        }),
                        center: [0, 0],
                        resolution: 1
                    })
                });
            },
            createStar(coordinates, geometry, points) {
                if (!geometry) geometry = new Polygon(null);
                let center = coordinates[0];
                let last = coordinates[1];
                let dx = center[0] - last[0];
                let dy = center[1] - last[1];
                let radius = Math.sqrt(dx * dx + dy * dy);
                let rotation = Math.atan2(dy, dx);
                let newCoordinates = [];
                for (let i=0; i<points; i++) {
                    let angle = rotation + i * 2 * Math.PI / points;
                    let fraction = i % 2 === 0 ? 1 : 0.5;
                    let offsetX = radius * fraction * Math.cos(angle);
                    let offsetY = radius * fraction * Math.sin(angle);
                    newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
                }
                newCoordinates.push(newCoordinates[0].slice());
                geometry.setCoordinates([newCoordinates]);
                return geometry;
            }
        },
        beforeRouteLeave(to, from, next) {
            if (this.player) this.player.destroy();
            next();
        }
    }
</script>
<style scoped>
    .player {
        width: 100%;
        height: 400px;
    }
    .overlayer {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
</style>
