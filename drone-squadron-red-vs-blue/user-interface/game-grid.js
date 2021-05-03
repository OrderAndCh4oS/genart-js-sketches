import {
    canvasHeight,
    canvasWidth,
    colours,
    context,
    debug,
} from '../constants/constants.js';
import Drone from '../drone.js';

export default class GameGrid {
    constructor() {
        this._gridBlockSize = 100;
        this._columns = Math.round(canvasWidth / this._gridBlockSize);
        this._rows = Math.round(canvasHeight / this._gridBlockSize);
        this._grid = new Array(this._columns);
        for(let i = 0; i < this._grid.length; i++) {
            this._grid[i] = new Array(this._rows);
            for(let j = 0; j < this._grid.length; j++) {
                this._grid[i][j] = [];
            }
        }
    }

    get gridBlockSize() {
        return this._gridBlockSize;
    }

    get columns() {
        return this._columns;
    }

    get rows() {
        return this._rows;
    }

    get grid() {
        return this._grid;
    }

    gridHasKeys(x, y) {
        return x >= 0 && x < this._columns && y >= 0 && y < this._rows;
    }

    addParticle(particle) {
        particle.gridX = Math.floor(particle.position.x / this.gridBlockSize);
        particle.gridY = Math.floor(particle.position.y / this.gridBlockSize);
        if(!this.gridHasKeys(particle.gridX, particle.gridY)) {
            return;
        }
        this._grid[particle.gridX][particle.gridY].push(particle);
    }

    removeParticle(particle) {
        if(!this.gridHasKeys(particle.gridX, particle.gridY)) {
            return;
        }
        this._grid[particle.gridX][particle.gridY] = this._grid[particle.gridX][particle.gridY].filter(
            (p) => p.id !== particle.id);
    }

    findGridRange(drone, radius) {
        const x = drone.position.x / this.gridBlockSize;
        const y = drone.position.y / this.gridBlockSize;
        const blockRadius = (radius / this.gridBlockSize) + 2;
        this.gridRange = {
            start: [
                Math.floor(x - blockRadius),
                Math.floor(y - blockRadius)],
            end: [
                Math.ceil(x + blockRadius),
                Math.ceil(y + blockRadius)],
        };
        this.forceRangeToGridRowsColumns();
        return this.gridRange;
    }

    forceRangeToGridRowsColumns() {
        if(this.gridRange.start[0] < 0) {
            this.gridRange.start[0] = 0;
        }
        if(this.gridRange.start[1] < 0) {
            this.gridRange.start[1] = 0;
        }
        if(this.gridRange.end[0] > this._columns) {
            this.gridRange.end[0] = this._columns;
        }
        if(this.gridRange.end[1] > this._rows) {
            this.gridRange.end[1] = this._rows;
        }
    }

    log() {
        if(debug.gameGridLog) {
            debug.gameGridLog = false;
            console.log(this.grid);
        }
    }

    draw() {
        this.drawGrid();
        this.drawGridContent();
    }

    drawGridContent() {
        context.font = '10px Verdana';
        context.textAlign = 'left';
        context.fillStyle = colours.green;
        if(debug.gameGridToggle) {
            for(let i = 0; i < this._grid.length; i++) {
                for(let j = 0; j < this._grid[i].length; j++) {
                    for(let k = 0; k < this._grid[i][j].length; k++) {
                        const item = this._grid[i][j][k];
                        const text = item instanceof Drone ? 'Drone:' +
                            item.name : item.id;
                        context.fillText(text, i * this._gridBlockSize + 4, j *
                            this._gridBlockSize + (10 * k + 14));
                    }
                }
            }
        }
    }

    drawGrid() {
        if(debug.gameGridToggle) {
            context.setLineDash([1, 7]);
            context.strokeStyle = colours.white;
            for(let i = 0; i < this._columns; i++) {
                context.fillText(i, i * this._gridBlockSize, 10);
                context.beginPath();
                context.moveTo(i * this._gridBlockSize, 0);
                context.lineTo(i * this._gridBlockSize, canvasHeight);
                context.stroke();
            }
            for(let i = 0; i < this._rows; i++) {
                context.fillText(i, 0, i * this._gridBlockSize + 10);
                context.beginPath();
                context.moveTo(0, i * this._gridBlockSize);
                context.lineTo(canvasWidth, i * this._gridBlockSize);
                context.stroke();
            }
            context.setLineDash([0]);
        }
    }
}
