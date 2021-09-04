class KdNode {
    _point;
    _left;
    _right;

    constructor(point) {
        this._point = point;
    }

    get point() {
        return this._point;
    }

    get x() {
        return this._point.x;
    }

    get y() {
        return this._point.y;
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    get coords() {
        return this._point.coords;
    }

    distanceTo(p2) {
        return this._point.distanceTo(p2);
    };

    setChildren(left, right) {
        this._left = left;
        this._right = right;
    }

    equals(p2) {
        if(!p2 instanceof KdNode) return false;
        return this._point.equals(p2);
    }
}
