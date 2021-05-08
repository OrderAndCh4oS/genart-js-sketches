import { colours, context } from '../constants/constants.js';
import PercentBox from '../user-interface/percent-box.js';

export default class Heath extends PercentBox {
    constructor(health) {
        super(0, 16, 16, 4, colours.green, colours.white);
        this._health = health;
        this._currentHealth = health;
    }

    get health() {
        return this._health;
    }

    get currentHealth() {
        return this._currentHealth;
    }

    takeDamage(damage) {
        this._currentHealth -= damage;
    }

    repairDamage(value) {
        if(this._currentHealth + value < this._health) {
            this._currentHealth += value;
        } else {
            this._currentHealth = this._health;
        }
    }

    draw(drone) {
        context.translate(drone.position.x, drone.position.y);
        this.setPercentage(this._currentHealth, this._health);
        this._fill = this._currentHealth <= 20 ? colours.red : colours.green;
        super.draw();
    }
}
