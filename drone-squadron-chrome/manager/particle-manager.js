import { didCollide, isOffCanvas } from '../functions.js';
import { dm } from '../constants/constants.js';

export default class ParticleManager {
    particles = [];

    init() {
        this.particles = [];
    }

    addParticle(particle) {
        this.particles.push(particle);
    }

    update() {
        this.particles = this.particles
            .map(p => {
                p.draw();
                p.update();
                this.collisionDetection(p);
                if(isOffCanvas(p)) {
                    p.removeParticle();
                }
                return p;
            })
            .filter(p => !p.remove && !isOffCanvas(p));
    }

    collisionDetection(p) {
        dm.drones.map((d) => {
            if(didCollide(p, d)) {
                const initialHealth = d.health.currentHealth;
                d.health.takeDamage(p.damage);
                if(p.id !== -1) {
                    if(initialHealth > 0 && d.health.currentHealth <= 0) {
                        p.tallyKill(d);
                    }
                    p.tallyDamage(p.damage);
                    p.removeParticle();
                }
            }
        });
    }
}
