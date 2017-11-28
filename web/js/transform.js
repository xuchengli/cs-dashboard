import Pointer from "ol/interaction/pointer";
import VectorLayer from "ol/layer/vector";
import VectorSource from "ol/source/vector";
import Feature from "ol/feature";
import Point from "ol/geom/point";
import Events from "ol/events";
import Obj from "ol/object";
import InteractionProperty from "ol/interaction/property";
import Extent from "ol/extent";
import Style from "ol/style/style";
import Fill from "ol/style/fill";
import Stroke from "ol/style/stroke";
import RegularShape from "ol/style/regularshape";
import Icon from "ol/style/icon";
import RotationCursor from "../images/rotation-cursor.svg";
import CloseHandle from "../images/close-handle.svg";
import RotationHandle from "../images/rotation-handle.svg";

class Transform extends Pointer {
    constructor(features = []) {
        super({
            handleDownEvent: Transform.prototype._handleDownEvent,
            handleDragEvent: Transform.prototype._handleDragEvent,
            handleMoveEvent: Transform.prototype._handleMoveEvent,
            handleUpEvent: Transform.prototype._handleUpEvent
        });
        /**
         * 拉伸，旋转，删除操作柄距离被操作元素的偏移量.
         * @private
         */
        this._sketchDelta = 10;
        /**
         * 被操作元素集.
         * @private
         */
        this._features = features;
        /**
         * 拉伸操作柄坐标（左上，上，右上，左，右，左下，下，右下，一共八个操作柄）.
         * @private
         */
        this._scaleHandle = {
            tl: { geometry: new Point([]) },
            t: { geometry: new Point([]) },
            tr: { geometry: new Point([]) },
            l: { geometry: new Point([]) },
            r: { geometry: new Point([]) },
            bl: { geometry: new Point([]) },
            b: { geometry: new Point([]) },
            br: { geometry: new Point([]) }
        };
        /**
         * 旋转操作柄和删除操作柄坐标.
         * @private
         */
        this._rotateHandle = { geometry: new Point([]) };
        this._deleteHandle = { geometry: new Point([]) };
        /**
         * 拉伸操作柄元素的图案是蓝色正方形
         * @private
         */
        this._scaleImage = new RegularShape({
            fill: new Fill({ color: "#00f" }),
            points: 4,
            radius: 10,
            angle: Math.PI / 4,
            stroke: new Stroke({ color: "#fff", width: 1 })
        });
        /**
         * 旋转和删除操作柄元素的图案设置成相应的svg图标
         * @private
         */
        this._rotateImage = new Icon({ src: RotationHandle });
        this._deleteImage = new Icon({ src: CloseHandle });
        /**
         * 根据八个拉伸操作柄坐标构建八个操作柄元素.
         * @private
         */
        for (let handle in this._scaleHandle) {
            this._scaleHandle[handle].feature = new Feature(this._scaleHandle[handle].geometry);
        }
        /**
         * 根据旋转操作柄坐标构建旋转操作柄元素，元素风格使用旋转图标.
         * @private
         */
        this._rotateHandle.feature = new Feature(this._rotateHandle.geometry);
        this._rotateHandle.feature.setStyle(new Style({ image: this._rotateImage }));
        /**
         * 根据删除操作柄坐标构建删除操作柄元素，元素风格使用删除图标.
         * @private
         */
        this._deleteHandle.feature = new Feature(this._deleteHandle.geometry);
        this._deleteHandle.feature.setStyle(new Style({ image: this._deleteImage }));
        /**
         * 拉伸，旋转，删除操作柄所在图层，
         * 默认操作柄元素的风格是蓝色正方形，适用于拉伸操作柄，旋转和删除操作柄风格使用单独的图标.
         * @private
         */
        this._overlay = new VectorLayer({
            source: new VectorSource({
                features: [
                    this._scaleHandle.tl.feature,
                    this._scaleHandle.t.feature,
                    this._scaleHandle.tr.feature,
                    this._scaleHandle.l.feature,
                    this._scaleHandle.r.feature,
                    this._scaleHandle.bl.feature,
                    this._scaleHandle.b.feature,
                    this._scaleHandle.br.feature,
                    this._rotateHandle.feature,
                    this._deleteHandle.feature
                ],
                useSpatialIndex: false
            }),
            style: new Style({ image: this._scaleImage })
        });
        /**
         * 添加，删除被操作元素，都会重新绘制十个操作柄的位置.
         */
        this._features.on(["add", "remove"], () => {
            this._setSketch(this._featuresExtent());
        });
        /**
         * 最近一次鼠标点击的坐标位置.
         * @type {ol.Coordinate}
         * @private
         */
        this._lastCoordinate = null;
        /**
         * 最近一次鼠标点击中的元素，可能是操作柄或者被操作元素.
         * @type {ol.Feature}
         * @private
         */
        this._lastFeature = null;
        /**
         * 操作柄的中心位置
         * @type {ol.Coordinate}
         * @private
         */
        this._sketchCentre = null;
        Events.listen(this, Obj.getChangeEventType(InteractionProperty.ACTIVE),
                        this._updateState, this);
    }
    _handleDownEvent(event) {
        this._lastFeature = this._featuresAtPixel(event.pixel, event.map);
        if (!this._lastCoordinate && this._lastFeature) {
            this._lastCoordinate = event.coordinate;
            this._handleMoveEvent(event);
            return true;
        }
        return false;
    }
    _handleDragEvent(event) {
        if (this._lastCoordinate) {
            let newCoordinate = event.coordinate;
            let deltaX = newCoordinate[0] - this._lastCoordinate[0];
            let deltaY = newCoordinate[1] - this._lastCoordinate[1];
            let geometries = this._features.getArray().map(feature => feature.getGeometry())
                    .concat(Object.values(this._scaleHandle).map(handle => handle.geometry))
                    .concat(this._deleteHandle.geometry).concat(this._rotateHandle.geometry);
            if (this._features.getArray().includes(this._lastFeature)) {
                geometries.forEach(geometry => { geometry.translate(deltaX, deltaY); });
            } else {
                let prow = null, anchor = null, sx = 1, sy = 1;
                switch(this._lastFeature) {
                    case this._scaleHandle.tl.feature:
                        prow = this._scaleHandle.tl.geometry.getCoordinates();
                        anchor = this._scaleHandle.br.geometry.getCoordinates();
                        if (prow[0] !== anchor[0]) sx = 1 - deltaX / (anchor[0] - prow[0]);
                        if (prow[1] !== anchor[1]) sy = 1 + deltaY / (prow[1] - anchor[1]);
                        geometries.forEach(geometry => { geometry.scale(sx, sy, anchor); });
                        break;
                    case this._scaleHandle.t.feature:
                        prow = this._scaleHandle.t.geometry.getCoordinates();
                        anchor = this._scaleHandle.b.geometry.getCoordinates();
                        if (prow[1] !== anchor[1]) sy = 1 + deltaY / (prow[1] - anchor[1]);
                        geometries.forEach(geometry => { geometry.scale(sx, sy, anchor); });
                        break;
                    case this._scaleHandle.tr.feature:
                        prow = this._scaleHandle.tr.geometry.getCoordinates();
                        anchor = this._scaleHandle.bl.geometry.getCoordinates();
                        if (prow[0] !== anchor[0]) sx = 1 + deltaX / (prow[0] - anchor[0]);
                        if (prow[1] !== anchor[1]) sy = 1 + deltaY / (prow[1] - anchor[1]);
                        geometries.forEach(geometry => { geometry.scale(sx, sy, anchor); });
                        break;
                    case this._scaleHandle.l.feature:
                        prow = this._scaleHandle.l.geometry.getCoordinates();
                        anchor = this._scaleHandle.r.geometry.getCoordinates();
                        if (prow[0] !== anchor[0]) sx = 1 - deltaX / (anchor[0] - prow[0]);
                        geometries.forEach(geometry => { geometry.scale(sx, sy, anchor); });
                        break;
                    case this._scaleHandle.r.feature:
                        prow = this._scaleHandle.r.geometry.getCoordinates();
                        anchor = this._scaleHandle.l.geometry.getCoordinates();
                        if (prow[0] !== anchor[0]) sx = 1 + deltaX / (prow[0] - anchor[0]);
                        geometries.forEach(geometry => { geometry.scale(sx, sy, anchor); });
                        break;
                    case this._scaleHandle.bl.feature:
                        prow = this._scaleHandle.bl.geometry.getCoordinates();
                        anchor = this._scaleHandle.tr.geometry.getCoordinates();
                        if (prow[0] !== anchor[0]) sx = 1 - deltaX / (anchor[0] - prow[0]);
                        if (prow[1] !== anchor[1]) sy = 1 - deltaY / (anchor[1] - prow[1]);
                        geometries.forEach(geometry => { geometry.scale(sx, sy, anchor); });
                        break;
                    case this._scaleHandle.b.feature:
                        prow = this._scaleHandle.b.geometry.getCoordinates();
                        anchor = this._scaleHandle.t.geometry.getCoordinates();
                        if (prow[1] !== anchor[1]) sy = 1 - deltaY / (anchor[1] - prow[1]);
                        geometries.forEach(geometry => { geometry.scale(sx, sy, anchor); });
                        break;
                    case this._scaleHandle.br.feature:
                        prow = this._scaleHandle.br.geometry.getCoordinates();
                        anchor = this._scaleHandle.tl.geometry.getCoordinates();
                        if (prow[0] !== anchor[0]) sx = 1 + deltaX / (prow[0] - anchor[0]);
                        if (prow[1] !== anchor[1]) sy = 1 - deltaY / (anchor[1] - prow[1]);
                        geometries.forEach(geometry => { geometry.scale(sx, sy, anchor); });
                        break;
                    case this._rotateHandle.feature:
                        let lastAngle = Math.atan2(
                            this._lastCoordinate[1] - this._sketchCentre[1],
                            this._lastCoordinate[0] - this._sketchCentre[0]
                        );
                        let newAngle = Math.atan2(
                            newCoordinate[1] - this._sketchCentre[1],
                            newCoordinate[0] - this._sketchCentre[0]
                        );
                        let deltaAngle = newAngle - lastAngle;
                        geometries.forEach(geometry => {
                            geometry.rotate(deltaAngle, this._sketchCentre);
                        });
                        this._scaleImage.setRotation(
                            this._scaleImage.getRotation() - deltaAngle);
                        this._rotateImage.setRotation(
                            this._rotateImage.getRotation() - deltaAngle);
                        this._deleteImage.setRotation(
                            this._deleteImage.getRotation() - deltaAngle);
                        break;
                }
            }
            this._lastCoordinate = newCoordinate;
        }
    }
    _handleMoveEvent(event) {
        let elem = event.map.getViewport();
        let feature = this._featuresAtPixel(event.pixel, event.map);
        if (feature) {
            if (this._features.getArray().includes(feature)) {
                elem.style.cursor = this._lastCoordinate ? "grabbing" : "grab";
            } else {
                switch(feature) {
                    case this._scaleHandle.tl.feature:
                    case this._scaleHandle.br.feature:
                        elem.style.cursor = "nwse-resize";
                        break;
                    case this._scaleHandle.tr.feature:
                    case this._scaleHandle.bl.feature:
                        elem.style.cursor = "nesw-resize";
                        break;
                    case this._scaleHandle.t.feature:
                    case this._scaleHandle.b.feature:
                        elem.style.cursor = "ns-resize";
                        break;
                    case this._scaleHandle.l.feature:
                    case this._scaleHandle.r.feature:
                        elem.style.cursor = "ew-resize";
                        break;
                    case this._deleteHandle.feature:
                        elem.style.cursor = "pointer";
                        break;
                    case this._rotateHandle.feature:
                        elem.style.cursor = "url(" + RotationCursor + ") 5 5, move";
                        break;
                    default:
                        elem.style.cursor = "auto";
                }
            }
        } else {
            elem.style.cursor = "auto";
        }
    }
    _handleUpEvent(event) {
        if (this._lastCoordinate) {
            this._lastCoordinate = null;
            this._lastFeature = null;
            this._handleMoveEvent(event);
            /**
             * 每次平移，拉伸，旋转后都重新计算操作柄中心位置.
             */
            this._sketchCentre = Extent.getCenter(this._featuresExtent());
        }
        return false;
    }
    setMap(map) {
        super.setMap(map);
        this._updateState();
    }
    _updateState() {
        let map = this.getMap();
        let active = this.getActive();
        this._overlay.setMap(active ? map : null);
    }
    _setCoordinates(tl = [], t = [], tr = [],
                    l = [], r = [],
                    bl = [], b = [], br = [],
                    del = [], rotation = []) {
        this._scaleHandle.tl.geometry.setCoordinates(tl);
        this._scaleHandle.t.geometry.setCoordinates(t);
        this._scaleHandle.tr.geometry.setCoordinates(tr);
        this._scaleHandle.l.geometry.setCoordinates(l);
        this._scaleHandle.r.geometry.setCoordinates(r);
        this._scaleHandle.bl.geometry.setCoordinates(bl);
        this._scaleHandle.b.geometry.setCoordinates(b);
        this._scaleHandle.br.geometry.setCoordinates(br);
        this._deleteHandle.geometry.setCoordinates(del);
        this._rotateHandle.geometry.setCoordinates(rotation);
    }
    _setSketch(extent = []) {
        if (extent.length && !Extent.isEmpty(extent)) {
            let tl = Extent.getTopLeft(extent);
            let tr = Extent.getTopRight(extent);
            let bl = Extent.getBottomLeft(extent);
            let br = Extent.getBottomRight(extent);
            let size = Extent.getSize(extent);
            let t = [tl[0] + size[0] / 2, tl[1]];
            let l = [tl[0], tl[1] - size[1] / 2];
            let r = [tr[0], tr[1] - size[1] / 2];
            let b = [bl[0] + size[0] / 2, bl[1]];
            this._setCoordinates(
                [tl[0] - this._sketchDelta, tl[1] + this._sketchDelta],
                [t[0], t[1] + this._sketchDelta],
                [tr[0] + this._sketchDelta, tr[1] + this._sketchDelta],
                [l[0] - this._sketchDelta, l[1]],
                [r[0] + this._sketchDelta, r[1]],
                [bl[0] - this._sketchDelta, bl[1] - this._sketchDelta],
                [b[0], b[1] - this._sketchDelta],
                [br[0] + this._sketchDelta, br[1] - this._sketchDelta],
                [tr[0] + this._sketchDelta * 4, tr[1] + this._sketchDelta * 4],
                [tr[0] + this._sketchDelta * 7, tr[1] + this._sketchDelta * 4]
            );
            this._sketchCentre = Extent.getCenter(extent);
            this._scaleImage.setRotation(0);
            this._rotateImage.setRotation(0);
            this._deleteImage.setRotation(0);
        } else {
            this._setCoordinates();
        }
    }
    _featuresAtPixel(pixel, map) {
        let sketch = Object.values(this._scaleHandle).map(handle => handle.feature)
                    .concat(this._rotateHandle.feature).concat(this._deleteHandle.feature);
        return map.forEachFeatureAtPixel(pixel, feature => {
            if (this._features.getArray().includes(feature) || sketch.includes(feature)) {
                return feature;
            }
        });
    }
    _featuresExtent() {
        let extent = [];
        let coordinates = this._features.getArray()
                .map(feature => feature.getGeometry().getFlatCoordinates())
                .reduce((acc, cur) => acc.concat(cur), []);
        if (coordinates.length > 2) {
            extent = Extent.createOrUpdateFromFlatCoordinates(
                coordinates, 0, coordinates.length, 2);
        }
        return extent;
    }
}
export default Transform;
