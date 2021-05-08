import { angleBetweenRange, angleTo, distanceTo } from '../../functions.js';

export default class Steering {
    constructor(turningSpeed) {
        this.turningSpeed = turningSpeed;
        this.turnAmount = 0;
        this.roaming = {callback: null, count: 0};
        this.evading = {callback: null, count: 0};
        this.dodging = {callback: null, count: 0};
    }

    turn(drone) {
        this.drone = drone;
        const angleToTarget = angleTo(drone.angle,
            drone.scanner.angleToTarget());
        switch(true) {
            case this.hasTargetCloseBehind(drone):
                this.evade();
                break;
            case this.hasThreats(drone):
                this.dodge();
                break;
            case this.hasNoTarget(drone):
                this.roam();
                break;
            case (angleToTarget >= 0.6):
                this.turnAmount = this.turningSpeed * 0.1;
                this.turnLeft();
                break;
            case (angleToTarget >= 0.4):
                this.turnAmount = this.turningSpeed * 0.066;
                this.turnLeft();
                break;
            case (angleToTarget >= 0.2):
                this.turnAmount = this.turningSpeed * 0.033;
                this.turnLeft();
                break;
            case (angleToTarget > 0):
                this.turnLeft(
                    angleToTarget);
                break;
            case (angleToTarget <= -0.6):
                this.turnAmount = this.turningSpeed * 0.1;
                this.turnRight();
                break;
            case (angleToTarget <= -0.4):
                this.turnAmount = this.turningSpeed * 0.066;
                this.turnRight();
                break;
            case (angleToTarget <= -0.2):
                this.turnAmount = this.turningSpeed * 0.033;
                this.turnRight();
                break;
            case (angleToTarget < 0):
                this.turnRight(
                    angleToTarget);
                break;
        }
    }

    hasTargetCloseBehind(drone) {
        return (drone.scanner.hasTarget() &&
            distanceTo(drone, drone.scanner.target) < 200 &&
            !angleBetweenRange(drone, Math.PI / 6));
    }

    hasThreats(drone) {
        return drone.scanner.threats > 0;
    }

    hasNoTarget(drone) {
        return !drone.scanner.hasTarget();
    }

    turnLeft() {
        this.incrementAngle(-this.turnAmount);
    }

    turnRight() {
        this.incrementAngle(this.turnAmount);
    }

    incrementAngle(increment) {
        this.drone.angle += increment;
    }

    roam() {
        if(this.roaming.count > 0) {
            this.turnAmount = this.turningSpeed * 0.033;
            this.roaming.callback();
            this.roaming.count--;
        } else {
            this.roaming.count = Math.floor(Math.random() * 60 + 20);
            this.roaming.callback = Math.random() > 0.5 ? this.turnRight.bind(
                this) : this.turnLeft.bind(this);
        }
    }

    evade() {
        if(this.evading.count > 0) {
            this.turnAmount = this.turningSpeed * 0.1;
            this.evading.callback();
            this.evading.count--;
        } else {
            this.evading.count = Math.floor(Math.random() * 35 + 15);
            this.evading.callback = Math.random() > 0.5 ? this.turnRight.bind(
                this) : this.turnLeft.bind(this);
        }
    }

    dodge() {
        if(this.dodging.count > 0) {
            this.turnAmount = this.turningSpeed * 0.06;
            this.dodging.callback();
            this.dodging.count--;
        } else {
            this.dodging.count = Math.floor(Math.random() * 10 + 5);
            this.dodging.callback = Math.random() > 0.5 ? this.turnRight.bind(
                this) : this.turnLeft.bind(this);
        }
    }
}
