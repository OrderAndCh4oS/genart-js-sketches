import { canvas, context } from '../constants/constants.js';

export default class Background {
    _star;

    constructor() {
        this._star = new Image();
        this.update()
    }

    update() {
        const stars = [];
        for(let i = 0; i < 40; i++) {
            stars.push({
                image: this._star,
                x: Math.floor(Math.random() * (canvas.width - 50) + 25),
                y: Math.floor(Math.random() * (canvas.height - 50) + 25),
            });
        }
        this._star.src = 'data:image/gif;base64,R0lGODdhBwAHAHcAACH5BAkKAAAALAAAAAAHAAcAwgAAAJaWlnl5eb29vdvb2wAAAAAAAAAAAAMRCBraMqKBFyWT4OYwyAialgAAOw==';
        this.background = {
            stars: stars,
        };
    }

    draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#101010';
        context.fillRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < this.background.stars.length; i++) {
            context.drawImage(
                this.background.stars[i].image,
                this.background.stars[i].x,
                this.background.stars[i].y,
            );
        }
    }
}
