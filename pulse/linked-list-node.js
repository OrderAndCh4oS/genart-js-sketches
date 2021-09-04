class LinkedListNode {
    _vector;
    _parent = null;
    _children = []

    constructor(x, y) {
        this._vector = new Vector(x, y);
    }

    get vector() {
        return this._vector;
    }

    get point() {
        return this._vector.point;
    }

    get x() {
        return this._vector.x;
    }

    get y() {
        return this._vector.y;
    }

    get coords() {
        return [this._vector.x, this._vector.y];
    }

    get parent() {
        return this._parent;
    }

    get children() {
        return this._children;
    }

    set parent(value) {
        this._parent = value;
    }

    clone() {
        return new LinkedListNode(this.x, this.y);
    }

    addNode(node) {
        node.parent = this;
        this._children.push(node);
    }

    distanceTo(p2) {
        return this._vector.distanceTo(p2);
    };

    equals(p2) {
        if(!p2 instanceof LinkedListNode) return false;
        return this._vector.equals(p2);
    }
}
