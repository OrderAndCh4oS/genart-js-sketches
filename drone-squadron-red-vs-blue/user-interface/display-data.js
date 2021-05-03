import { colours, context } from '../constants/constants.js';

export default class DisplayData {
    constructor(x, y, colour, align = 'left', size = 16) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.align = align;
        this.size = size;
        this.lines = [];
    }

    addLine(text) {
        this.lines.push(text);
    }

    textStyle() {
        context.textAlign = this.align;
        context.font = this.size + 'px Verdana';
        context.fillStyle = colours[this.colour];
    }

    draw() {
        this.textStyle();
        this.lines.map((line, index) => {
            context.fillText(
                line,
                this.x,
                this.y + (index + 1) * (this.size * 1.2),
            );
        });
    }
}
