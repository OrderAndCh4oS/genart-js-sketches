class Node {
    _point;
    _edge = null;
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

    get next() {
        return this._edge;
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

    makeEdge(node) {
        const edge = new Edge(this, node);
        this._edge = edge;

        return edge;
    }

    removeEdge() {
        this._edge = null;
    }

    distanceTo(p2) {
        return this._point.distanceTo(p2);
    };

    setChildren(left, right) {
        this._left = left;
        this._right = right;
    }

    equals(p2) {
        if(!p2 instanceof Node) return false;
        return this._point.equals(p2);
    }
}
