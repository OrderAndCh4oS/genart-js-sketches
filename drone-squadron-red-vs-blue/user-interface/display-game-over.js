import { canvasHeight, canvasWidth, squadrons, } from '../constants/constants.js';
import DisplayData from './display-data.js';

export default class GameOver extends DisplayData {

    constructor() {
        super(canvasWidth / 2, canvasHeight / 2 - 40, 'green', 'center', 32);
    }

    draw() {
        this.addLine('Game Over');
        if(squadrons[0].health > squadrons[1].health) {
            this.addLine(squadrons[0].name + ' Wins');
        } else if(squadrons[1].health > squadrons[0].health) {
            this.addLine(squadrons[1].name + ' Wins');
        } else {
            this.addLine('Draw');
        }
    }
}
