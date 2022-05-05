class Vector extends Point {
    constructor(x, y) {
        super(x, y);
    }

    get angle() {
        return Math.atan2(this._y, this._x);
    }

    set angle(angle) {
        const length = this.length;
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    }

    get length() {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    set length(length) {
        const angle = this.angle;
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    }

    add(v2) {
        return new Vector(this._x + v2.x, this._y + v2.y);
    }

    subtract(v2) {
        return new Vector(this._x - v2.x, this._y - v2.y);
    }

    multiply(value) {
        return new Vector(this._x * value, this._y * value);
    }

    divide(value) {
        return new Vector(this._x / value, this._y / value);
    }

    addTo(v2) {
        this._x += v2.x;
        this._y += v2.y;
    }

    subtractFrom(v2) {
        this._x -= v2.x;
        this._y -= v2.y;
    }

    multiplyBy(value) {
        this._x *= value;
        this._y *= value;
    }

    divideBy(value) {
        this._x /= value;
        this._y /= value;
    }

    angleTo(b) {
        return Math.atan2(
            b.y - this._y,
            b.x - this._x,
        );
    }

    distanceTo(b) {
        const dx = b.x - this._x, dy = b.y - this._y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    pullTo(b, weight, minDist = 0) {
        if(this.distanceTo(b) > minDist) {
            const v = new Vector(b.x, b.y);
            v.subtractFrom(this);
            v.multiplyBy(weight);
            this.addTo(v);
        }
    }

    pushFrom(b, weight, maxDist = Infinity) {
        if(this.distanceTo(b) < maxDist) {
            const v = new Vector(this._x, this._y);
            v.subtractFrom(b);
            v.multiplyBy(weight);
            this.addTo(v);
        }
    }

    clone() {
        return new Vector(this._x, this._y);
    }
}
