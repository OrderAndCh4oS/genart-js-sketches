import { angleBetweenRange, distanceTo } from '../../functions.js';
import { colours, context } from '../../constants/constants.js';

export default class Thruster {
    constructor(thrust) {
        this.thrust = thrust;
        this.roaming = {callback: null, count: 0};
    }

    setPower(drone) {
        this.drone = drone;
        this.power = 1;
        switch(true) {
            case this.targetIsCloseBehind(drone) || this.hasThreats(drone):
                this.startThrusting(1);
                break;
            case this.targetIsTooClose(drone):
                this.stopThrusting();
                break;
            case drone.scanner.hasTarget() &&
            angleBetweenRange(drone.angle, drone.scanner.angleToTarget(),
                0.2):
                this.power = this.getPowerFromDistance(drone);
                this.startThrusting(this.power);
                break;
            case drone.scanner.hasTarget() &&
            angleBetweenRange(drone.angle, drone.scanner.angleToTarget(),
                0.3):
                this.power = 0.8 * this.getPowerFromDistance(drone);
                this.startThrusting();
                break;
            case drone.scanner.hasTarget() &&
            angleBetweenRange(drone.angle, drone.scanner.angleToTarget(),
                0.6):
                this.power = 0.4;
                this.startThrusting();
                break;
            default:
                if(this.roaming.count <= 0) {
                    this.roaming.count = Math.random() * 25 + 5;
                    this.roaming.callback = Math.random() > 0.4
                        ? this.startThrusting.bind(this)
                        : this.stopThrusting.bind(this);
                }
                this.power = 0.5;
                this.roaming.callback();
                this.roaming.count--;
        }
    }

    startThrusting() {
        this.drone.velocity.setLength(this.thrust * this.power);
    }

    stopThrusting() {
        this.power = 0;
    }

    isThrusting() {
        return this.power > 0;
    }

    draw(drone) {
        if(this.isThrusting()) {
            context.translate(drone.position.x, drone.position.y);
            context.rotate(drone.vector.getAngle());
            context.beginPath();
            context.moveTo(-0, -2);
            context.lineTo(-8, Math.floor(Math.random() * 2) - 3);
            context.lineTo(-6, -1);
            context.lineTo(-10, Math.floor(Math.random() * 3) - 1);
            context.lineTo(-6, 1);
            context.lineTo(-8, Math.floor(Math.random() * 2) + 2);
            context.lineTo(-4, 2);
            context.strokeWidth = 0.5;
            context.strokeStyle = colours.orange;
            context.stroke();
            context.fillStyle = colours.red;
            context.fill();
            context.resetTransform();
        }
    }

    targetIsCloseBehind() {
        return this.drone.scanner.hasTarget() &&
            distanceTo(this.drone, this.drone.scanner.target) < 400 &&
            this.targetIsBehind(this.drone);
    }

    targetIsTooClose() {
        return this.drone.scanner.hasTarget() &&
            distanceTo(this.drone, this.drone.scanner.target) < 30 &&
            angleBetweenRange(this.drone, 0.6);
    }

    getPowerFromDistance(drone) {
        switch(true) {
            case distanceTo(drone, drone.scanner.target) > 800:
                return this.targetIsAhead(drone) ? 1 : 0;
            case distanceTo(drone, drone.scanner.target) > 600:
                return this.targetIsAhead(drone) ? 0.8 : 0.2;
            case distanceTo(drone, drone.scanner.target) > 300:
                return this.targetIsAhead(drone) ? 0.6 : 0.4;
            case distanceTo(drone, drone.scanner.target) > 200:
                return this.targetIsAhead(drone) ? 0.4 : 0.6;
            case distanceTo(drone, drone.scanner.target) > 100:
                return this.targetIsAhead(drone) ? 0.2 : 0.8;
            default:
                return this.targetIsAhead(drone) ? 0.1 : 0.9;
        }
    }

    targetIsAhead(target) {
        return angleBetweenRange(target, Math.PI / 2);
    }

    targetIsBehind(target) {
        return !angleBetweenRange(target, Math.PI / 2);
    }

    hasThreats(drone) {
        return drone.scanner.threats > 0;
    }
}
