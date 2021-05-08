import { canvas, colours } from '../constants/constants.js';
import PercentBox from '../user-interface/percent-box.js';

export default class Squadron {
    constructor(id, name, colour) {
        this.id = id;
        this._name = name;
        this.colour = colour;
        this.drones = [];
    }

    get name() {
        return this._name;
    }

    get kills() {
        return this.drones
            .map(d => d.kills)
            .reduce((a, b) => a + b);
    }

    get health() {
        return this.drones
            .map(d => d.health.currentHealth > 0
                ? d.health.currentHealth
                : 0)
            .reduce((a, b) => a + b);
    }

    get startHealth() {
        return this.drones.map(d => d.health.health)
            .reduce((a, b) => a + b);
    }

    addDrone(drone) {
        this.drones.push(drone);
    }

    drawHealth(index) {
        const healthBar = new PercentBox(
            canvas.width / 4 * (index * 2 + 1),
            24,
            canvas.width * 0.45,
            14,
            colours[this.colour],
            colours.white,
        );
        healthBar.setPercentage(this.health, this.startHealth);
        healthBar.draw();
    }
}
