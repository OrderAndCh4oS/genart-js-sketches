import Weapon from '../abstract/weapon.js';
import NineMM from '../ammo/nine-mm.js';
import { audioHandler, context } from '../../constants/constants.js';

export default class Uzi extends Weapon {
    constructor(drone, x, y, angle, gimbal) {
        const fireRate = 2;
        const round = NineMM;
        super(drone, 'Uzi', '#8aa', x, y, angle, gimbal, round, fireRate);
    }

    draw() {
        context.translate(this.position.x, this.position.y);
        context.rotate(this.gimbal.vector.getAngle() + this.droneAngle);
        context.beginPath();
        context.lineTo(6, -1);
        context.lineTo(6, 1);
        context.lineTo(0, 1);
        context.lineTo(0, -1);
        this.applyStroke();
        this.applyFill();
        context.resetTransform();
    }

    fire() {
        super.fire();
        audioHandler.play('uzi', 0.3);
    }
}
