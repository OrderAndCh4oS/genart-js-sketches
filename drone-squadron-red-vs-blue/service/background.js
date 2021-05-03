import { canvasHeight, canvasWidth, context } from '../constants/constants.js';

export default class Background {
    constructor() {
        const star = new Image();
        const stars = [];
        for(let i = 0; i < 40; i++) {
            stars.push({
                image: star,
                x: Math.floor(Math.random() * (canvasWidth - 50) + 25),
                y: Math.floor(Math.random() * (canvasHeight - 50) + 25),
            });
        }
        star.src = 'data:image/gif;base64,R0lGODdhBwAHAHcAACH5BAkKAAAALAAAAAAHAAcAwgAAAJaWlnl5eb29vdvb2wAAAAAAAAAAAAMRCBraMqKBFyWT4OYwyAialgAAOw==';
        this.background = {
            stars: stars,
        };
    }

    draw() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.fillStyle = '#011428';
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        for(let i = 0; i < this.background.stars.length; i++) {
            context.drawImage(
                this.background.stars[i].image,
                this.background.stars[i].x,
                this.background.stars[i].y,
            );
        }
    }
}
