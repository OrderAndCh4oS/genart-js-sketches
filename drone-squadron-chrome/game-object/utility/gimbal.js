import Vector from '../../service/vector.js';
import { angleTo } from '../../functions.js';

export default class Gimbal {

    constructor(angleLimit, turningSpeed) {
        this.vector = new Vector(0, 0);
        this.vector.setAngle(0);
        this.vector.setLength(5);
        this.rotation = 'right';
        this._angleLimit = angleLimit;
        this.turningSpeed = turningSpeed;
    }

    get angleLimit() {
        return this._angleLimit;
    }

    trackTarget(drone) {
        if(drone.scanner.hasTarget()) {
            switch(true) {
                case (angleTo(drone.angle + this.vector.getAngle(),
                    drone.scanner.angleToTarget()) > 0.05):
                    this.rotation = 'left';
                    break;
                case (angleTo(drone.angle + this.vector.getAngle(),
                    drone.scanner.angleToTarget()) < -0.05):
                    this.rotation = 'right';
                    break;
                default:
                    return;
            }
        }
        this.turn();
    }

    turn() {
        switch(true) {
            case this.rotation === 'right' &&
            this.vector.getAngle() < this._angleLimit:
                this.vector.setAngle(this.vector.getAngle() +
                    this.turningSpeed);
                break;
            case this.rotation === 'left' &&
            this.vector.getAngle() > -this._angleLimit:
                this.vector.setAngle(this.vector.getAngle() -
                    this.turningSpeed);
                break;
            case this.rotation === 'right' &&
            this.vector.getAngle() > this._angleLimit:
                this.rotation = 'left';
                break;
            case this.rotation === 'left' &&
            this.vector.getAngle() < -this._angleLimit:
                this.rotation = 'right';
                break;
        }
    }
}
