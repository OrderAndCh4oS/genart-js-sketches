class FlockData {
    _boids;
    _boidCount;
    _preIterations;
    _iterations;
    _matchVelocityMod;
    _tendTowardMassMod;
    _tendTowardCenterMod;
    _context;
    _width;
    _height;
    _colours;
    _tail;
    _scaleMod;
    _fxFeatures = {};
    _blendMode;
    _altColour;

    constructor(context, width, height, colours, blendMode, altColour) {
        this._context = context;
        this._width = width;
        this._height = height;
        this._colours = colours;
        this._blendMode = blendMode;
        this._altColour = altColour;
        this.initTail();
        this.initScaleType();
        this.initScaleMod();
        this.initMakeBoid();
        this.initUnits();
    }

    drawShape = (index) => [
        (boid) => {
            this._context.globalCompositeOperation = 'source-over';
            this._context.lineCap = 'butt';
            this._context.lineWidth = 6 * (this._scaleMod * 1.5);
            this._context.strokeStyle = this._altColour;
            this._context.beginPath();
            this._context.moveTo(boid.lastPosition.x, boid.lastPosition.y);
            this._context.lineTo(boid.position.x, boid.position.y);
            this._context.stroke();
            this._context.lineCap = 'round';
            this._context.lineWidth = 3 * (this._scaleMod * 1.5);
            this._context.strokeStyle = boid.colour;
            this._context.beginPath();
            this._context.moveTo(boid.lastPosition.x, boid.lastPosition.y);
            this._context.lineTo(boid.position.x, boid.position.y);
            this._context.stroke();
        },
        (boid, scale = 1) => {
            this._context.globalCompositeOperation = this._blendMode;
            this._context.fillStyle = boid.colour;
            this._context.beginPath();
            this._context.arc(boid.position.x, boid.position.y, 3 * scale,
                0, Math.PI * 2, true);
            this._context.fill();
        },
        (boid) => {
            this._context.globalCompositeOperation = this._blendMode;
            this._context.lineWidth = 3 * (this._scaleMod * 1.5);
            this._context.strokeStyle = boid.colour;
            this._context.beginPath();
            this._context.moveTo(boid.lastPosition.x, boid.lastPosition.y);
            this._context.lineTo(boid.position.x, boid.position.y);
            this._context.stroke();
        },
        (boid) => {
            this._context.globalCompositeOperation = 'source-over';
            this._context.lineCap = 'round';
            this._context.lineWidth = 16 * this._scaleMod;
            this._context.strokeStyle = this._altColour;
            this._context.beginPath();
            this._context.moveTo(boid.lastPosition.x, boid.lastPosition.y);
            this._context.lineTo(boid.position.x, boid.position.y);
            this._context.stroke();
            this._context.lineWidth = 14 * this._scaleMod;
            this._context.strokeStyle = boid.colour;
            this._context.beginPath();
            this._context.moveTo(boid.lastPosition.x, boid.lastPosition.y);
            this._context.lineTo(boid.position.x, boid.position.y);
            this._context.stroke();
        },
        (boid, scale = 1) => {
            this._context.globalCompositeOperation = this._blendMode;
            this._context.lineCap = 'round';
            this._context.lineWidth = 6;
            this._context.strokeStyle = boid.colour;
            const r = scale === 1 ? 4 * scale : (fxrand() * 6) + 3 * scale;
            let {x, y} = boid.position;
            x = x - r / 2;
            y = y - r / 2;
            this._context.beginPath();
            this._context.moveTo(x, y);
            this._context.lineTo(x + r, y + r);
            this._context.stroke();
            this._context.beginPath();
            this._context.moveTo(x + r, y);
            this._context.lineTo(x, y + r);
            this._context.stroke();
        }
    ][index];

    get boids() {
        return this._boids;
    }

    get scaleMod() {
        return this._scaleMod;
    }

    get scaleType() {
        return this._scaleType;
    }

    get preIterations() {
        return this._preIterations;
    }

    get iterations() {
        return this._iterations;
    }

    get matchVelocityMod() {
        return this._matchVelocityMod;
    }

    get tendTowardMassMod() {
        return this._tendTowardMassMod;
    }

    get tendTowardCenterMod() {
        return this._tendTowardCenterMod;
    }

    get drawShape() {
        return this._drawShape;
    }

    get tail() {
        return this._tail;
    }

    get fxFeatures() {
        return this._fxFeatures;
    }

    initScaleMod() {
        const roll = ~~(fxrand() * 5);
        this._fxFeatures['Scale Modifier'] = roll;
        this._scaleMod = [1, 1.01, 1.03, 1.05, 1.1][roll];
    }

    initScaleType() {
        const roll = ~~(fxrand() * 2);
        this._fxFeatures['Scale Type'] = roll;
        this._scaleType = roll;
    }

    initTail() {
        const roll = 8 + ~~(fxrand() * 12)
        this._fxFeatures['Tail'] = roll;
        this._tail = roll;
    }

    initUnits() {
        const roll = ~~(fxrand() * 7);
        this._fxFeatures['Unit Set'] = roll;
        switch(roll) {
            case 0:
                this.setUnits(32, 50, 5000, 1.5E-05, 1.0E-05, 7.5E-6);
                break;
            case 1:
                this.setUnits(40, 500, 6000, 1.875E-6, 3.75E-5, 3.125E-5);
                break;
            case 2:
                this.setUnits(22, 0, 3500, 0.0004, 0.000375, 0.0003);
                break;
            case 3:
                this.setUnits(32, 50, 1500, 0.0003, 0.0002, 0.00015);
                break;
            case 4:
                this.setUnits(40, 500, 750, 0.0003, 0.0006, 0.0004);
                break;
            case 5:
                this.setUnits(22, 0, 5000, 0.00006, 0.00008, 0.00005);
                break;
            case 6:
                this.setUnits(28, 50, 10000, 7.5E-6, 5.0E-6, 4.25E-6);
                break;
        }
    }

    initMakeBoid() {
        const roll = ~~(fxrand() * 4);
        this._fxFeatures['Boid Positions'] = roll;
        this._makeBoid = [
            () => new Boid(
                fxrand() * this._width,
                fxrand() * this._height,
                this._colours[~~(fxrand() * this._colours.length)]
            ),
            () => new Boid(
                fxrand() * this._width,
                this._height / 2 + (fxrand() * 200) - 100,
                this._colours[~~(fxrand() * this._colours.length)]
            ),
            () => new Boid(
                fxrand() * this._width / 2,
                fxrand() * this._height / 2,
                this._colours[~~(fxrand() * this._colours.length)]
            ),
            () => new Boid(
                fxrand() * this._width / 8,
                fxrand() * this._height,
                this._colours[~~(fxrand() * this._colours.length)]
            ),
        ][roll];
    }

    setupBoids() {
        this._boids = [];
        for(let i = 0; i < this._boidCount; i++) {
            this._boids.push(this._makeBoid());
        }
    }

    setUnits(
        boidCount,
        preIterations,
        iterations,
        tendTowardCenterMod,
        matchVelocityMod,
        tendTowardMassMod
    ) {
        this._boidCount = boidCount;
        this._preIterations = preIterations;
        this._iterations = iterations;
        this._matchVelocityMod = matchVelocityMod;
        this._tendTowardMassMod = tendTowardMassMod;
        this._tendTowardCenterMod = tendTowardCenterMod;
    }
}

class Flock {
    _flockData;
    _centre;
    _iterations;
    _previewTriggered = false;

    constructor(flockData, centre) {
        this._flockData = flockData;
        this._centre = centre;
        this._iterations = 0;
    }

    tendTowardCenter(b) {
        const v4 = new Vector(this._centre.x, this._centre.y);
        v4.subtractFrom(b.position);
        v4.multiplyBy(this._flockData.tendTowardCenterMod);
        return v4;
    }

    matchVelocityOfNearBoids(b) {
        const v3 = new Vector(0, 0);
        for(const b2 of this._flockData.boids) {
            if(b.position.equals(b2.position)) continue;
            v3.addTo(b2.velocity);
        }
        v3.divideBy(this._flockData.boids.length - 1);
        v3.subtractFrom(b.velocity);
        v3.multiplyBy(this._flockData.matchVelocityMod);
        return v3;
    }

    moveTowardCentreOfMass(b) {
        const v1 = new Vector(0, 0);
        for(const b2 of this._flockData.boids) {
            if(b.position.equals(b2.position)) continue;
            v1.addTo(b2.position);
        }
        v1.divideBy(this._flockData.boids.length - 1);
        v1.subtractFrom(b.position);
        v1.multiplyBy(this._flockData.tendTowardMassMod);

        return v1;
    }

    moveAwayFromOtherBoids(b) {
        const v2 = new Vector(0, 0);
        for(const b2 of this._flockData.boids) {
            if(b.position.equals(b2.position)) continue;
            if(b.position.distanceTo(b2.position) < 10)
                v2.subtractFrom(b.position.subtract(b2.position));
        }
        return v2;
    }

    init() {
        for(let i = 0; i < this._flockData.preIterations; i++) {
            for(const b of this._flockData.boids) {
                const v1 = this.moveTowardCentreOfMass(b);
                const v2 = this.moveAwayFromOtherBoids(b);
                const v3 = this.matchVelocityOfNearBoids(b);
                const v4 = this.tendTowardCenter(b);
                b.update(v1, v2, v3, v4);
            }
        }
    }

    draw(modeIndex) {
        if(this._iterations >= this._flockData.iterations) {
            if(!this._previewTriggered && isFxpreview) fxpreview();
            this._previewTriggered = true;
            return;
        }
        let scale;

        for(let i = 0; i < this._flockData.tail; i++) {
            if(this._flockData.scaleType === 1) {
                scale = 1;
            }
            for(const b of this._flockData.boids) {
                if(this._flockData.scaleType === 0) {
                    scale = 1;
                    for(let j = 0; j < i; j++) {
                        scale *= this._flockData.scaleMod;
                    }
                }
                const v1 = this.moveTowardCentreOfMass(b);
                const v2 = this.moveAwayFromOtherBoids(b);
                const v3 = this.matchVelocityOfNearBoids(b);
                const v4 = this.tendTowardCenter(b);
                b.update(v1, v2, v3, v4);
                this._flockData.drawShape(modeIndex)(b, scale);
                if(this._flockData.scaleType === 1) {
                    scale *= this._flockData.scaleMod;
                }
            }
        }
        this._iterations += this._flockData.tail;
    }
}
