class Point {
    _x;
    _y;

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    equals(o) {
        if(!o instanceof Point) return false;
        return !(o.x() !== this._x || o.y() !== this._y);

    }

    setX(x) {
        this._x = x;
    }

    setY(y) {
        this._y = y;
    }

    x() {
        return this._x;
    }

    y() {
        return this._y;
    }

    isFinite() {
        return this._x !== Infinity && this._y !== Infinity;
    }
}
