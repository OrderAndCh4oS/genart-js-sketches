import Bullet from '../abstract/bullet.js';
import { colours } from '../../constants/constants.js';

export default class Shot extends Bullet {
    constructor(drone, x, y, angle, velocity) {
        super(drone, x, y, 38, 2, angle, velocity, 1);
        this._colour = colours.greyTwo;
    }
}
