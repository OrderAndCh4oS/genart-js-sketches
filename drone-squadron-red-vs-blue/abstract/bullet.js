import Particle from './particle.js';

export default class Bullet extends Particle {
    constructor(drone, x, y, speed, radius, angle, velocity, damage) {
        super(drone.id, x, y, speed, radius, angle);
        this._drone = drone;
        this._damage = damage;
        this.velocity.addTo(velocity);
    }

    get squadId() {
        return this._drone.squadId;
    }

    get damage() {
        return this._damage;
    }

    tallyKill(killedDrone) {
        this._drone.updateKills(killedDrone);
    }

    tallyDamage(damage) {
        this._drone.updateDamage(damage);
    }
}
