import Bullet from '../abstract/bullet.js';
import { colours } from '../../constants/constants.js';

export default class NineMM extends Bullet {
    constructor(drone, x, y, angle, velocity) {
        super(drone, x, y, 45, 3, angle, velocity, 3);
        this._colour = colours.greyTwo;
    }
}
