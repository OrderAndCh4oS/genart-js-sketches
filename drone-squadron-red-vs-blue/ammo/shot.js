import Bullet from '../abstract/bullet.js';

export default class Shot extends Bullet {
    constructor(drone, x, y, angle, velocity) {
        super(drone, x, y, 38, 2, angle, velocity, 1);
    }
}
