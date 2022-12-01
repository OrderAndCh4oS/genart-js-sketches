class KinematicArm {
    _x = 0;
    _y = 0;
    _length = 100;
    _angle = 0;
    _parent = null;

    constructor(x, y, length, angle) {
        this._x = x;
        this._y = y;
        this._length = length;
        this._angle = angle;
    }

    set parent(value) {
        this._parent = value;
    }

    get parent() {
        return this._parent;
    }

    get angle() {
        return this._angle;
    }

    set angle(value) {
        this._angle = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get length() {
        return this._length;
    }

    getEndX() {
        return this._x + Math.cos(this._angle) * this._length;
    }

    getEndY() {
        return this._y + Math.sin(this._angle) * this._length;
    }

    pointAt(x, y) {
        const dx = x - this._x,
              dy = y - this._y;
        this.angle = Math.atan2(dy, dx);
    }

    drag(x, y) {
        this.pointAt(x, y);
        this._x = x - Math.cos(this._angle) * this.length;
        this._y = y - Math.sin(this._angle) * this.length;
        if(this._parent) {
            this._parent.drag(this._x, this._y);
        }
    }
}
