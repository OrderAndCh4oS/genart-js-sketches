class Vector {
    _point = new Point(1, 0);

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get x() {
        return this._point.x;
    }

    set x(value) {
        this._point.x = value;
    }

    set point(point) {
        this._point = point;
    }

    get y() {
        return this._point.y;
    }

    set y(value) {
        this._point.y = value;
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

    angleTo(b) {
        return Math.atan2(
            b.y - this.y,
            b.x - this.x,
        );
    }

    distanceTo(b) {
        const dx = b.x - this.x, dy = b.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    pullTo(b) {
        const pull = new Vector(0, 0), dist = this.distanceTo(b);
        const length = 2000 / (dist * dist);
        pull.length = length < 5 ? length : 5;
        pull.angle = this.angleTo(b);
        this.addTo(pull);
    }

    pushFrom(b) {
        const push = new Vector(0, 0), dist = this.distanceTo(b);
        const length = 2000 / (dist * dist);
        push.length = length < 50 ? length : 50;
        push.angle = new Vector(b.x, b.y).angleTo(this) + (Math.random() * Math.PI);
        this.addTo(push);
    }
}
