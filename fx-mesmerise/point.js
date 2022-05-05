class Point {
    _x;
    _y;

    constructor(x, y) {
        this._x = x;
        this._y = y;
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

    get coords() {
        return [this._x, this._y]
    }

    distanceTo(p2) {
        const dx = p2.x - this._x, dy = p2.y - this._y;
        return Math.sqrt(dx * dx + dy * dy)
    };

    equals(p2) {
        if(!p2 instanceof Point) return false;
        return !(p2.x !== this._x || p2.y !== this._y);
    }

    isFinite() {
        return this._x !== Infinity && this._y !== Infinity;
    }

    clone() {
        return new Point(this._x, this._y);
    }
}
