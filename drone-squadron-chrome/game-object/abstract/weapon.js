import { context, pm } from '../../constants/constants.js';
import { deltaTime } from '../../service/delta-time.js';
import Vector from '../../service/vector.js';
import { angleTo } from '../../functions.js';

export default class Weapon {
    constructor(drone, name, colour, x, y, angle, gimbal, round, fireRate) {
        this.drone = drone;
        this.id = drone.id;
        this.squadId = drone.squadId;
        this.colour = colour;
        this.position = new Vector(x, y);
        this.velocity = 0;
        this.fireRate = fireRate;
        this.lastFired = 0;
        this.gimbal = new gimbal();
        this.round = round;
        this._name = name;
    }

    get name() {
        return this._name;
    }

    draw() {
        context.translate(this.position.x, this.position.y);
        context.rotate(this.gimbal.vector.getAngle() + this.droneAngle);
        context.beginPath();
        context.lineTo(10, -2);
        context.lineTo(10, 2);
        context.lineTo(0, 2);
        context.lineTo(0, -2);
        context.strokeStyle = this.colour;
        context.stroke();
        context.fillStyle = this.colour;
        context.fill();
        context.resetTransform();
    }

    update(drone) {
        this.position.x = drone.position.x;
        this.position.y = drone.position.y;
        this.velocity = drone.velocity;
        this.droneAngle = drone.vector.getAngle();
        this.gimbal.trackTarget(drone);
        const angleToTarget = angleTo(drone.angle,
            drone.scanner.angleToTarget());
        if(
            drone.scanner.hasTarget() &&
            angleToTarget <= this.gimbal.angleLimit &&
            angleToTarget >= -this.gimbal.angleLimit
        ) {
            this.fireIfReady();
        }
    }

    fireIfReady() {
        if((deltaTime.getElapsedTime() - this.lastFired) > this.fireRate) {
            this.fire();
            this.lastFired = deltaTime.getElapsedTime();
        }
    }

    fire() {
        pm.addParticle(
            new this.round(
                this.drone,
                this.position.x,
                this.position.y,
                this.gimbal.vector.getAngle() + this.droneAngle,
                this.velocity,
            ),
        );
    }

    applyFill() {
        context.fillStyle = this.colour;
        context.fill();
    }

    applyStroke() {
        context.strokeStyle = this.colour;
        context.stroke();
    }
}
