class Vector extends Point {
    constructor(x, y) {
        super(x, y);
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
        return new Vector(this.x + v2.x, this.y + v2.y);
    }

    subtract(v2) {
        return new Vector(this.x - v2.x, this.y - v2.y);
    }

    multiply(value) {
        return new Vector(this.x * value, this.y * value);
    }

    divide(value) {
        return new Vector(this.x / value, this.y / value);
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
            const v = new Vector(this.x, this.y);
            v.subtractFrom(b);
            v.multiplyBy(weight);
            this.addTo(v);
        }
    }

    moveAwayFrom(b, distance) {
        const push = new Vector(0, 0);
        push.length = distance
        push.angle = new Vector(b.x, b.y).angleTo(this) + (Math.random() * Math.PI / 2);
        this.addTo(push);
    }
}
