class Particle {
    position = null;
    velocity = null;
    gravity = null;
    mass = 1;
    radius = 0;
    bounce = -1;
    friction = 0.99;

    constructor(x, y, speed, direction, grav, friction, mass) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.velocity.length = speed;
        this.velocity.angle = direction;
        this.gravity = new Vector(0, grav || 0);
        this.friction = friction;
        this.mass = mass;
    }

    get point() {
        return new Point(this.position.x, this.position.y);
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
        const grav = new Vector(0, 0),
            dist = this.distanceTo(p2);
        console.log(dist);
        grav.length = p2.mass / (dist * dist);
        grav.angle = this.angleTo(p2);
        console.log('L', grav.length);
        console.log('A', grav.angle);
        this.velocity.addTo(grav);
    }
}
