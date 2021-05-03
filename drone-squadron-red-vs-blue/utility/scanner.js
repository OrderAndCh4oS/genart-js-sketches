import { colours, context, debug, grid } from '../constants/constants.js';
import Drone from '../drone.js';
import Bullet from '../abstract/bullet.js';
import { angleTo } from '../functions.js';

export default class Scanner {
    constructor(radius) {
        this.radius = radius;
        this._target = null;
        this._drone = null;
        this._threats = 0;
    }

    get threats() {
        return this._threats;
    }

    get target() {
        return this._target;
    }

    hasTarget() {
        return this._target !== null;
    }

    scanArea(drone) {
        this._threats = 0;
        this._drone = drone;
        this._target = null;
        this.nearestTarget = {target: null, distance: null};
        this.gridRange = grid.findGridRange(drone, this.radius);
        this.scanGridRange(drone, this.nearestTarget);
        this.selectTargetIfValid();
    }

    scanGridRange() {
        for(let i = this.gridRange.start[0]; i < this.gridRange.end[0]; i++) {
            for(let j = this.gridRange.start[1]; j <
            this.gridRange.end[1]; j++) {
                grid.grid[i][j].map((item) => {
                    this.detectThreats(item);
                    this.findNearestDrone(item);
                });
            }
        }
    }

    detectThreats(item) {
        const angleToItem = angleTo(item.angle,
            this.angleToParticle(item));
        if(
            (item instanceof Bullet) &&
            item.squadId !== this._drone.squadId &&
            this.distanceToParticle(item) < 300 &&
            (angleToItem <= 0.15 || angleToItem >= -0.15)
        ) {
            this._threats++;
        }
    }

    selectTargetIfValid() {
        if(this.nearestTarget.target !== null &&
            this.nearestTarget.distance <= this.radius &&
            this.nearestTarget.target.health.currentHealth > 0) {
            this._target = this.nearestTarget.target;
        } else {
            this._target = null;
        }
    }

    findNearestDrone(item) {
        if((item instanceof Drone) && item.squadId !== this._drone.squadId) {
            const distanceTo = this.distanceToParticle(item);
            if(this.nearestTarget.distance === null ||
                distanceTo < this.nearestTarget.distance) {
                this.nearestTarget.target = item;
                this.nearestTarget.distance = distanceTo;
            }
        }
    }

    angleToTarget() {
        return this.hasTarget() ? this.angleToParticle(this._target) : 0;
    }

    angleToParticle(particle) {
        return Math.atan2(
            particle.position.y - this._drone.position.y,
            particle.position.x - this._drone.position.x,
        );
    }

    distanceToParticle(particleTwo) {
        const dx = particleTwo.position.x - this._drone.position.x,
            dy = particleTwo.position.y - this._drone.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    draw(drone) {
        if(this.hasTarget()) {
            context.translate(this.target.position.x,
                this.target.position.y);
            context.beginPath();
            context.moveTo(-5, -5);
            context.lineTo(5, 5);
            context.moveTo(5, -5);
            context.lineTo(-5, 5);
            context.strokeStyle = drone.colour;
            context.strokeWidth = 5;
            context.stroke();
            context.resetTransform();
            this.drawScannerPath(drone);
        }
        this.drawScannerRadius(drone);
    }

    drawScannerPath(drone) {
        if(debug.scannerPathToggle) {
            context.setLineDash([1, 5]);
            context.beginPath();
            context.moveTo(drone.position.x, drone.position.y);
            context.lineTo(this.target.position.x,
                this.target.position.y);
            context.strokeStyle = colours.white;
            context.stroke();
            context.setLineDash([0]);
        }
    }

    drawScannerRadius(drone) {
        if(debug.scannerRadiusToggle) {
            context.setLineDash([1, 5]);
            context.beginPath();
            context.arc(
                drone.position.x,
                drone.position.y,
                this.radius,
                0,
                2 * Math.PI);
            context.strokeStyle = colours.white;
            context.stroke();
            context.setLineDash([0]);
        }
    }
}
