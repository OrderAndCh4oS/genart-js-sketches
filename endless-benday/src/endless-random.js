export function makeRandomFromSeed() {
    const seedString = window.endlessWaysTokenInfo.seed;
    var seedNumber = 1;
    for (var i=0; i<8; i++) {
        var part = seedString.substring(i*8, (i+1)*8);
        seedNumber ^= parseInt(part, 16);
    }

    return new Random(seedNumber);
}

class Random {
    constructor(seed = 10000) {
        if (seed < 0) {
            seed = Math.abs(seed);
        }
        this.seed = seed % 2147483647
        if (this.seed === 0) {
            this.seed = 1;
        }
    }

    randomInt(a, b) {
        return ~~(this.randomFloat(~~(a), ~~(b)));
    }

    random() {
        this.seed = (this.seed * 48271) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    randomFloat(a, b) {
        const r = this.random();
        const range = b-a;
        return a + r*range;
    }
}
