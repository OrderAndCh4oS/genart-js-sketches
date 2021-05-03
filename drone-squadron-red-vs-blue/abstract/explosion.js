import Particle from './particle.js';
import { context } from '../constants/constants.js';

export default class Explosion extends Particle {
    constructor(id, x, y) {
        super(id, x, y, 0, 48, 0);
        this._sprite = 'data:image/png;base64,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';
        this._explosionImage = new Image();
        this._explosionImage.src = this._sprite;
        this._frame = 0;
        this._damage = 0;
    }

    get damage() {
        return this._damage;
    }

    update() {
        this._frame++;
        if(this._frame > 8) {
            this._remove = true;
        }
    }

    draw() {
        context.translate(this.position.x - 24, this.position.y - 24);
        context.drawImage(this._explosionImage, 48 * this._frame, 0, 48, 48, 0,
            0, 48, 48);
        context.resetTransform();
    }
}
