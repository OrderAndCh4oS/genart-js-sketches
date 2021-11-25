class Line {
    _a;
    _b;
    _colour;
    _width = 1;

    constructor(a, b) {
        this._a = a;
        this._b = b
    }

    get a() {
        return this._a;
    }

    get b() {
        return this._b;
    }

    set colour(value) {
        this._colour = value;
    }

    get colour() {
        return this._colour;
    }

    get midpoint() {
        return new Point((this._a.x + this._b.x) * 0.5,
            (this._a.y + this._b.y) * 0.5);
    }

    get length() {
        const dx = this._b.x - this._a.x, dy = this._b.y - this._a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    get width() {
        return this._width;
    }

    set width(width) {
        this._width = width;
    }

    isEqual(l2) {
        return this.a.x === l2.a.x && this.b.x === l2.b.x && this.a.y ===
            l2.a.y && this.b.y === l2.b.y;
    }

    getIntersect(l2) {
        const a1 = this.a.y - this.b.y;
        const b1 = this.b.x - this.a.x;
        const c1 = a1 * this.b.x + b1 * this.b.y;

        const a2 = l2.a.y - l2.b.y;
        const b2 = l2.b.x - l2.a.x;
        const c2 = a2 * l2.b.x + b2 * l2.b.y;

        const delta = a1 * b2 - a2 * b1;
        return new Point((b2 * c1 - b1 * c2) / delta,
            (a1 * c2 - a2 * c1) / delta);
    }

    onSegment(r) {
        return r.x <= Math.max(this.a.x, this.b.x) && r.x >=
            Math.min(this.a.x, this.b.x) && r.y <=
            Math.max(this.a.y, this.b.y) && r.y >= Math.min(this.a.y, this.b.y);
    }

    isIntersect(l2) {
        const intersect = this.getIntersect(l2);
        return intersect.isFinite() && this.onSegment(intersect) &&
            l2.onSegment(intersect);
    }

    getAngle() {
        const dX = this._a.x - this._b.x;
        const dY = this._a.y - this._b.y;
        return Math.atan2(dY, dX);
    }
}
