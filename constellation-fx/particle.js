class Particle extends Node {
    position = null;
    velocity = null;
    gravity = null;
    mass = 1;
    radius = 0;
    bounce = -1;
    friction = 0.99;

    constructor(x, y, speed, direction, grav, friction, mass) {
        const position = new Vector(x, y);
        super(position);
        this.position = position;
        this.velocity = new Vector(0, 0);
        this.velocity.length = speed;
        this.velocity.angle = direction;
        this.gravity = new Vector(0, grav || 0);
        this.friction = friction;
        this.mass = mass;
    }

    accelerate(accel) {
        this.velocity.addTo(accel);
    }

    update() {
        this.velocity.multiplyBy(this.friction);
        this.velocity.addTo(this.gravity);
        this.position.addTo(this.velocity);
    }

    angleTo(p2) {
        return Math.atan2(
            p2.position.y - this.position.y,
            p2.position.x - this.position.x,
        );
    }

    distanceTo(p2) {
        const dx = p2.position.x - this.position.x,
            dy = p2.position.y - this.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    gravitateTo(p2) {
        const gravity = new Vector(0, 0),
            dist = this.distanceTo(p2);
        if(dist === 0) return;
        gravity.length = p2.mass / (dist * dist);
        gravity.angle = this.angleTo(p2);
        this.velocity.addTo(gravity);
    }

    pushAway(p2) {
        const force = new Vector(0, 0),
            dist = this.distanceTo(p2);
        force.length = p2.mass / (dist * dist);
        force.angle = this.angleTo(Math.PI + p2);
        this.velocity.addTo(force);
    }

    equals(p2) {
        return p2.x === this._x && p2.y === this._y;
    }
}
