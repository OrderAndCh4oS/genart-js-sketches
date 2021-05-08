import Weapon from '../abstract/weapon.js';
import { audioHandler, context, pm } from '../../constants/constants.js';
import Shot from '../ammo/shot.js';

export default class Shotgun extends Weapon {
    constructor(drone, x, y, angle, gimbal) {
        const fireRate = 7;
        const round = Shot;
        super(drone, 'Shotgun', '#664', x, y, angle, gimbal, round, fireRate);
    }

    draw() {
        context.translate(this.position.x, this.position.y);
        context.rotate(this.gimbal.vector.getAngle() + this.droneAngle);
        context.beginPath();
        context.lineTo(8, -2);
        context.lineTo(8, 2);
        context.lineTo(0, 2);
        context.lineTo(0, -2);
        this.applyStroke();
        this.applyFill();
        context.resetTransform();
    }

    fire() {
        for(let i = 0; i < 12; i++) {
            const scatter = Math.random() * 0.08 - 0.04;
            pm.addParticle(
                new this.round(
                    this.drone,
                    this.position.x,
                    this.position.y,
                    this.gimbal.vector.getAngle() + this.droneAngle + scatter,
                    this.velocity,
                ),
            );
        }
        audioHandler.play('shotgun', 0.8);
    }
}
