class Attractors {
    _attractors = [];

    get attractors() {
        return this._attractors;
    }

    initRandom(count) {
        for(let i = 0; i < count; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            this.add(new KdNode(new Point(x, y)));
        }
    }

    add(attractor) {
        this._attractors.push(attractor);
    }

    remove(attractor) {
        this._attractors.splice(this._attractors.indexOf(attractor), 1);
    }
}
