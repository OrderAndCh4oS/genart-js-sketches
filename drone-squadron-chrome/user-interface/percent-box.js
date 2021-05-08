import { context } from '../constants/constants.js';

export default class PercentBox {

    constructor(x, y, width, height, fill, stroke) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._fill = fill;
        this._stroke = stroke;
        this._percentage = 100;
    }

    setPercentage(value, total) {
        this._percentage = value / total * 100;
    }

    draw() {
        context.translate(this._x - this._width / 2, this._y);
        this.drawStroke();
        this.drawFill();
        context.resetTransform();
    }

    drawFill() {
        this.drawPercentBox(this._percentage);
        context.fillStyle = this._fill;
        context.fill();
    }

    drawStroke() {
        this.drawPercentBox();
        context.strokeStyle = this._stroke;
        context.stroke();
    }

    drawPercentBox(percentage = 100) {
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this._width * percentage / 100, 0);
        context.lineTo(this._width * percentage / 100, this._height);
        context.lineTo(0, this._height);
        context.lineTo(0, 0);
    }
}
