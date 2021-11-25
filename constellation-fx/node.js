class Node {
    _point;
    _leftEdge = null;
    _rightEdge = null;
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

    get leftEdge() {
        return this._leftEdge;
    }

    get rightEdge() {
        return this._rightEdge;
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
        node.setLeftEdge(this);
        this.setRightEdge(node);

        return this._rightEdge;
    }

    setRightEdge(node) {
        this._rightEdge = new Edge(this, node);
    }

    setLeftEdge(node) {
        this._leftEdge = new Edge(this, node);
    }

    removeEdge() {
        this._rightEdge = null;
    }

    distanceTo(p2) {
        return this._point.distanceTo(p2);
    };

    setChildren(left, right) {
        this._left = left;
        this._right = right;
    }

    equals(p2) {
        return p2.x === this._point.x && p2.y === this._point.y;
    }
}
