class Wave {
    _points = [];
    _startPoint;
    _iteration = 0;
    _a;
    _v;
    _s;
    _thickness;
    _waveHeight = 40;
    _height;

    constructor(point, value, speed, height) {
        this._startPoint = point.clone();
        this._v = value;
        this._s = speed;
        this._a = 0;
        this._height = height;
        for(let y = this._startPoint.y; y < this._height; y += this._s) {
            this._a += this._v;
            const dX = Math.sin(this._a) * this._waveHeight;
            const x = this._startPoint.x + dX - dX / 2;
            this._points.push(new Point(x, y));
        }
    }

    update(waveSpeed) {
        this._iteration += 1;
        this._a = (Math.PI / waveSpeed) * this._iteration;
        for(let i = 0; i < this._points.length; i++){
            let point = this._points[i];
            this._a += this._v;
            const dX = Math.sin(this._a) * this._waveHeight;
            point.x = this._startPoint.x + dX - dX / 2;
        }
    }

    get points() {
        return this._points
    }
}
