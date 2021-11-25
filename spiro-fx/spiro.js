class Spiro {
    _angle1 = 0;
    _angle2 = 0;
    _radius1;
    _radius2;
    _x;
    _y;
    _colour;
    _midX;
    _midY;

    constructor(midX, midY, colour) {
        const width = window.innerWidth;
        this._midX = midX;
        this._midY = midY;
        this._colour = colour;
        this._angle1Increment = fxrand() * 0.1 + 0.1;
        this._angle2Increment = fxrand() * 0.1 + 0.1;
        this._radius1 = width * (fxrand() * 0.015 + 0.01);
        this._radius2 = width * (fxrand() * 0.005 + 0.01);
    }

    get x() {
        return this._midX + this._x;
    }

    get y() {
        return this._midY + this._y;
    }

    get colour() {
        return this._colour;
    }

    update() {
        const x1 = this._radius1 * Math.cos(this._angle1);
        const y1 = this._radius1 * Math.sin(this._angle2);

        const x2 = x1 + this._radius2 * Math.cos(this._angle2);
        const y2 = y1 + this._radius2 * Math.sin(this._angle1);

        this._x = x2;
        this._y = y2;

        this._angle1 += this._angle1Increment;
        this._angle2 += this._angle2Increment;
    }
}
