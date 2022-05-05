class Boid {
    _velocity;
    _position;
    _lastPosition;
    _points = [];
    _colour;

    get colour() {
        return this._colour;
    }

    get points() {
        return this._points;
    }

    get position() {
        return this._position;
    }

    get lastPosition() {
        return this._lastPosition;
    }

    get velocity() {
        return this._velocity;
    }

    constructor(x, y, colour) {
        this._colour = colour;
        this._lastPosition = new Vector(x, y);
        this._position = new Vector(x, y);
        this._velocity = new Vector((fxrand() * 4) - 2, (fxrand() * 4) - 2);
    }

    update(v1, v2, v3, v4) {
        this._lastPosition = this._position.clone();
        this._velocity.addTo(v1);
        this._velocity.addTo(v2);
        this._velocity.addTo(v3);
        this._velocity.addTo(v4);
        this._position.addTo(this._velocity);
        this._points.push(new Point(this._position.x, this._position.y));
    }
}
