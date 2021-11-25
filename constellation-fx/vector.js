class Vector {
    _point = new Point(1, 0);

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get point() {
        return this._point;
    }

    get x() {
        return this._point.x;
    }

    set x(value) {
        this._point.x = value;
    }

    get y() {
        return this._point.y;
    }

    set y(value) {
        this._point.y = value;
    }

    get coords() {
        return [this._point._x, this._point._y]
    }

    get angle() {
        return Math.atan2(this.y, this.x);
    }

    set angle(angle) {
        const length = this.length;
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set length(length) {
        const angle = this.angle;
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    add(v2) {
        return vector.create(this.x + v2.x, this.y + v2.y);
    }

    subtract(v2) {
        return vector.create(this.x - v2.x, this.y - v2.y);
    }

    multiply(value) {
        return vector.create(this.x * value, this.y * value);
    }

    divide(value) {
        return vector.create(this.x / value, this.y / value);
    }

    addTo(v2) {
        this.x += v2.x;
        this.y += v2.y;
    }

    subtractFrom(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
    }

    multiplyBy(value) {
        this.x *= value;
        this.y *= value;
    }

    divideBy(value) {
        this.x /= value;
        this.y /= value;
    }

    equals(p2) {
        return p2.x === this._x && p2.y === this._y;
    }
}
