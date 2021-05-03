import Point from './point.js';

export default class Vector {
    constructor(x, y) {
        this._position = new Point(x, y);
    }

    get x() {
        return this._position.x;
    }

    set x(value) {
        this._position.x = value;
    }

    get y() {
        return this._position.y;
    }

    set y(value) {
        this._position.y = value;
    }

    get point() {
        return this._position;
    }

    set point(value) {
        this._position = value;
    }

    setAngle(angle) {
        const length = this.getLength();
        this._position.x = Math.cos(angle) * length;
        this._position.y = Math.sin(angle) * length;
    }

    getAngle() {
        return Math.atan2(this._position.y, this._position.x);
    }

    setLength(length) {
        const angle = this.getAngle();
        this._position.x = Math.cos(angle) * length;
        this._position.y = Math.sin(angle) * length;
    }

    getLength() {
        return Math.sqrt(this._position.x * this._position.x +
            this._position.y *
            this._position.y);
    }

    add(v2) {
        return new Vector(this._position.x + v2.x, this._position.y + v2.y);
    }

    subtract(v2) {
        return new Vector(this._position.x - v2.x, this._position.y - v2.y);
    }

    multiply(value) {
        return new Vector(this._position.x * value, this._position.y * value);
    }

    divide(value) {
        return new Vector(this._position.x / value, this._position.y / value);
    }

    addTo(v2) {
        this._position.x += v2.x;
        this._position.y += v2.y;
    }

    subtractFrom(v2) {
        this._position.x -= v2.x;
        this._position.y -= v2.y;
    }

    multiplyBy(value) {
        this._position.x *= value;
        this._position.y *= value;
    }

    divideBy(value) {
        this._position.x /= value;
        this._position.y /= value;
    }

    angleTo(v2) {
        Math.atan2(
            v2.y - this.y,
            v2.x - this.x,
        );
    }
}
