class Harmonograph {
    _frequency;
    _phase;
    _amplitude;
    _damping;

    constructor(_frequency, _phase, _amplitude, _damping) {
        this._frequency = _frequency;
        this._phase = _phase;
        this._amplitude = _amplitude;
        this._damping = _damping;
    }

    getValue(t) {
        const angle = t * this._frequency + this._phase;
        const x1 = this._amplitude * Math.sin(angle);
        return x1 * Math.pow(Math.exp(1), -this._damping * t);
    }
}
