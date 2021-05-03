import { colours, context, friction, grid } from '../constants/constants.js';

import Vector from '../service/vector.js';
import { deltaTime } from '../service/delta-time.js';

export default class Particle {
    constructor(id, x, y, speed, radius, angle) {
        this._id = id;
        this.radius = radius;
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.velocity.setLength(speed);
        this.velocity.setAngle(angle);
        this._remove = false;
        this._colour = colours.white;
        this._gridX = Math.floor(this.position.x / grid.gridBlockSize);
        this._gridY = Math.floor(this.position.y / grid.gridBlockSize);
    }

    get gridY() {
        return this._gridY;
    }

    set gridY(value) {
        this._gridY = value;
    }

    get gridX() {
        return this._gridX;
    }

    set gridX(value) {
        this._gridX = value;
    }

    get remove() {
        return this._remove;
    }

    get id() {
        return this._id;
    }

    get colour() {
        return this._colour;
    }

    update() {
        this.move();
    }

    move() {
        let distanceByDeltaTime = this.velocity.multiply(deltaTime.getTime());
        this.velocity.multiply(friction);
        grid.removeParticle(this);
        this.position.addTo(distanceByDeltaTime);
        grid.addParticle(this);
    }

    removeParticle() {
        this._remove = true;
        grid.removeParticle(this);
    }

    draw() {
        context.beginPath();
        context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            2 * Math.PI);
        context.fillStyle = this._colour;
        context.fill();
        context.strokeStyle = this._colour;
        context.stroke();
    }
}
