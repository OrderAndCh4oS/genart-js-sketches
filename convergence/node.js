class Node {
    _point;
    _leftEdge = null;
    _rightEdge = null;
    _left;
    _right;
    _lifeTime;
    _force;

    constructor(
        x,
        y,
        lifeTime,
        force
        ) {
        this._force = force;
        this._point = new Vector(x, y);
        this._lifeTime = lifeTime;
    }

    decrementLifeTime() {
        this._lifeTime--;
    }

    get force() {
        return this._force;
    }

    get lifeTime() {
        return this._lifeTime;
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
        if(!p2 instanceof Node) return false;
        return this._point.equals(p2);
    }
}
