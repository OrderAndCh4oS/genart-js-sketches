import { colours, context, debug } from '../constants/constants.js';
import Vector from '../service/vector.js';
import Particle from './abstract/particle.js';
import Health from '../service/health.js';
import { drones } from '../constants/sprites.js';
import { gimbals, scanners, steering, thrusters } from '../constants/utilities.js';
import { weapons } from '../constants/weapons.js';
import DisplayData from '../user-interface/display-particle-data.js';

export default class Drone extends Particle {
    constructor(drone, squad, x, y, angle) {
        super(drone.id, x, y, 0, 13, angle);
        this._squadId = squad.id;
        this._colour = squad.colour;
        this.name = drone.name;
        this.vector = new Vector(0, 1);
        this.vector.setAngle(angle);
        this.weapon = new weapons[drone.weapon](this, x, y, angle, gimbals[drone.gimbal]);
        this.scanner = new scanners[drone.scanner]();
        this.thruster = new thrusters[drone.thruster]();
        this.steering = new steering[drone.steering]();
        this.health = new Health(100);
        this._damage = 0;
        this._kills = 0;
        this._killed = [];
    }

    get killed() {
        return this._killed;
    }

    get damage() {
        return this._damage;
    }

    get kills() {
        return this._kills;
    }

    get squadId() {
        return this._squadId;
    }

    get angle() {
        return this.vector.getAngle();
    }

    set angle(angle) {
        this.vector.setAngle(angle);
    }

    updateDamage(damage) {
        this._damage += damage;
    }

    updateKills(killedDrone) {
        this._kills++;
        this._killed.push(killedDrone);
    }

    update() {
        this.scanner.scanArea(this);
        this.thruster.setPower(this);
        this.steering.turn(this);
        if(this.thruster.isThrusting()) {
            this.velocity.setAngle(this.vector.getAngle());
        }
        this.move();
        this.weapon.update(this);
    }

    draw() {
        this.weapon.draw();
        this.thruster.draw(this);
        context.translate(this.position.x, this.position.y);
        this.drawName();
        this.drawData();
        this.drawSprite();
        context.resetTransform();
        this.health.draw(this);
        this.scanner.draw(this);
    }

    drawSprite() {
        context.rotate(this.vector.getAngle() + (Math.PI / 180) * 90);
        context.translate(-12.5, -14);
        context.drawImage(drones[this._colour], 0, 0);
    }

    drawDrone() {
        context.beginPath();
        context.moveTo(10, 0);
        context.lineTo(-10, -7);
        context.lineTo(-10, 7);
        context.lineTo(10, 0);
        context.strokeStyle = this._colour;
        context.stroke();
        context.fillStyle = this._colour;
        context.fill();
    }

    drawName() {
        if(debug.droneNameToggle) {
            context.font = '11px Verdana';
            context.textAlign = 'center';
            context.fillStyle = colours[this._colour];
            context.fillText(this.name, 0, -18);
        }
    }

    drawData() {
        if(debug.droneDataToggle) {
            const positionText = `Position: (${Math.round(
                this.position.x)}, ${Math.round(this.position.y)})`;
            const gridText = `Grid: (${this.gridX}, ${this.gridY})`;
            const displayData = new DisplayData(0, 0, this.colour);
            displayData.addLine('ID: ' + this.id);
            displayData.addLine('SquadID: ' + this.squadId);
            displayData.addLine('Weapon: ' + this.weapon.name);
            displayData.addLine('Health: ' + this.health.currentHealth);
            displayData.addLine('Damage: ' + this._damage);
            displayData.addLine('Kills: ' + this._kills);
            displayData.addLine(positionText);
            displayData.addLine(gridText);
            displayData.draw();
        }
    }
}
