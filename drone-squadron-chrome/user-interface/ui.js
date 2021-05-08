import DisplayData from './display-data.js';
import { canvas, squadrons } from '../constants/constants.js';

export default class UI {
    static displaySquadData() {
        squadrons.map((s, i) => {
            s.drawHealth(i);
            const displaySquadData = new DisplayData(
                canvas.width / 4 * (i * 2 + 1),
                40,
                s.colour,
                'center'
            );
            displaySquadData.addLine(s.name);
            displaySquadData.addLine(`Kills: ${s.kills}`);
            displaySquadData.draw();
        });
    }

    static displayGameOver() {

    }
}
