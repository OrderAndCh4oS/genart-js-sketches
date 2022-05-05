class Wave {
    _points = [];
    _startPoint;
    _iteration = 0;
    _a;
    _v;
    _s;
    _thickness;
    _waveHeight;
    _height;

    constructor(point, value, speed, height, waveHeight) {
        this._waveHeight = waveHeight;
        this._startPoint = point.clone();
        this._v = value;
        this._s = speed;
        this._a = 0;
        this._height = height;
        for(let y = this._startPoint.y; y < this._height * 1.5; y += this._s) {
            this._a += this._v;
            const x = 0;
            this._points.push(new Point(x, y));
        }
    }

    update(waveSpeed) {
        this._a = (Math.PI / waveSpeed) * this._iteration;
        for(let i = 0; i < this._points.length; i++){
            let point = this._points[i];
            this._a += this._v;
            point.x = Math.sin(this._a) * this._waveHeight;
        }
        this._iteration += 1;
    }

    get points() {
        return this._points
    }
}
