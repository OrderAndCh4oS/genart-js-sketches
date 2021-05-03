class RgbToHsl {
    _r = null;
    _g = null;
    _b = null;
    _min = null;
    _max = null;
    _h = 0;
    _s = 0;
    _l = 0;

    fromRgbHex(rgb) {
        this.fromRgbValues(
            this.getRed(rgb),
            this.getGreen(rgb),
            this.getBlue(rgb)
        );
    }

    fromRgbValues(r, g, b) {
        this._r = r / 255;
        this._g = g / 255;
        this._b = b / 255;
        let rgbNormalised = [this._r, this._g, this._b].sort();
        this._min = rgbNormalised[0];
        this._max = rgbNormalised[2];
        this._h = this.calcH();
        this._l = this.calcL();
        this._s = this.calcS();
    }

    getRed(rgb) {
        return (rgb >> 16) & 0x0ff;
    }

    getGreen(rgb) {
        return (rgb >> 8) & 0x0ff;
    }

    getBlue(rgb) {
        return (rgb) & 0x0ff;
    }

    calcH() {
        if (this._r === null || this._g === null || this._b === null || this._max === null || this._min === null) throw new Error('Values not initialised')
        if (this._max === this._r) {
            this._h = Math.round(((this._g - this._b) / (this._max - this._min)) * 60);
        } else if (this._max === this._g) {
            this._h = Math.round((2.0 + (this._b - this._r) / (this._max - this._min)) * 60);
        } else if (this._max === this._b) {
            this._h = Math.round((4.0 + (this._r - this._g) / (this._max - this._min)) * 60);
        }
if (this._h < 0) {
            this._h += 360;
        }
return this._h;
    }

    calcL() {
        if (this._max === null || this._min === null) throw new Error('Values not initialised')
        return Math.round(((this._min + this._max) / 2) * 100);
    }

    calcS() {
        if (this._max === null || this._min === null) throw new Error('Values not initialised')
        if (this._min === this._max) return 0;
        if (this._l < 50) {
            this._s = Math.round(((this._max - this._min) / (this._max + this._min)) * 100);
        } else {
            this._s = Math.round(((this._max - this._min) / (2.0 - this._max - this._min)) * 100);
        }
return this._s;
    }

    get h() {
        return this._h;
    }

    get s() {
        return this._s;
    }

    get l() {
        return this._l;
    }

    get r() {
        return this._r * 255;
    }

    get g() {
        return this._g * 255;
    }

    get b() {
        return this._b * 255;
    }

    darken(value) {
        this._l -= value;
        if (this._l < 0) this._l = 0;
    }

    lighten(value) {
        this._l -= value;
        if (this._l > 100) this._l = 100;
    }

    set h(value) {
        if (value > 360) {
            this._h = value - 360;
        } else if (value < 0) {
            this._h = 360 + value;
        } else {
            this._h = value;
        }
    }

    set s(value) {
        if (value > 100) {
            this._s = 100;
        } else if (value < 0) {
            this._s = 0;
        } else {
            this._s = value;
        }
    }

    set l(value) {
        if (this._l > 100) {
            this._l = 100;
        } else if (this._l < 0) {
            this._l = 0;
        } else {
            this._l = value;
        }
    }

    get rgb() {
        let l = this._l / 100;
        let s = this._s / 100;
        let h = this._h / 360;
if (s === 0) {
            let grey = Math.round(l * 255);
            return this.toRgb(grey, grey, grey);
        }
let t1, t2, tr, tg, tb;
t1 = l < 0.5
            ? l * (1.0 + s)
            : l + s - (l * s);
t2 = (2 * l) - t1;
tr = h + 0.333;
        tg = h;
        tb = h - 0.333;
if (tr > 1) tr = tr - 1;
        if (tg > 1) tg = tg - 1;
        if (tb > 1) tb = tb - 1;
if (tr < 0) tr = tr + 1;
        if (tg < 0) tg = tg + 1;
        if (tb < 0) tb = tb + 1;
let r = this.toRgb(t1, t2, tr);
        let g = this.toRgb(t1, t2, tg);
        let b = this.toRgb(t1, t2, tb);
return this.bitShiftRgb(
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        );
    }

    bitShiftRgb(r, g, b) {
        return ((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff);
    }

    toRgb(x1, x2, tc) {
        if ((6 * tc) < 1) {
            return x2 + (x1 - x2) * 6 * tc;
        } else if ((2 * tc) < 1) {
            return x1;
        } else if ((3 * tc) < 2) {
            return (x2 + (x1 - x2) * (0.666 - tc) * 6);
        } else {
            return x2;
        }
    }
}
