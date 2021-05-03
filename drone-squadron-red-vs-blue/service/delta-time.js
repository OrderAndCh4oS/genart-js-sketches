class DeltaTime {

    constructor() {
        this.startTime = Date.now();
        this.lastTime = Date.now();
        this.currentTime = Date.now();
        this.deltaTime = 0;
    }

    update() {
        this.currentTime = Date.now();
        this.deltaTime = this.currentTime - this.lastTime;
        this.lastTime = this.currentTime;
    }

    getTime() {
        return this.deltaTime / 100;
    }

    getOffsetTime(offset) {
        return this.deltaTime / 100 + offset;
    }

    getElapsedTime() {
        return (this.currentTime - this.startTime) / 100;
    }

    getOffsetElapsedTime(offset) {
        return (this.currentTime - this.startTime) / 100 + offset;
    }
}

export const deltaTime = new DeltaTime();