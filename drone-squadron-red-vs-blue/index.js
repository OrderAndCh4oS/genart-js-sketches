import {
    background,
    debug,
    dm,
    game,
    grid,
    pm,
    squadrons,
    canvas,
    canvasHeight,
    canvasWidth
} from './constants/constants.js';
import { deltaTime } from './service/delta-time.js';
import SquadronFactory from './factory/squadron-factory.js';
import UI from './user-interface/ui.js';
import GameOver from './user-interface/display-game-over.js';

let fpsInterval, startTime, now, then, elapsed;

debug.initialiseListeners();

window.onresize = () => {
    location.reload();
}
window.onload = () => {
    initialise()
}

function initialise() {
    fetch('./data/squads.json')
        .then(resp => resp.json())
        .then((data) => {
            setupDrones(data.data);
            startAnimating(60);
        });
}


function setupDrones(data) {
    squadrons.splice(0, squadrons.length)
    data.squadrons.map(s => squadrons.push(SquadronFactory.make(s)));
}

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function setFrameTimeData() {
    now = Date.now();
    elapsed = now - then;
    if(elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
    }
}

function animate() {
    background.draw();
    deltaTime.update();
    dm.update();
    pm.update();
    grid.draw();
    grid.log();
    UI.displaySquadData();
    squadrons.map(s => {
        if(s.health <= 0) {
            game.state = 'game-over';
        }
    });
    if(game.state === 'game-over') {
        new GameOver().draw();
    }
    requestAnimationFrame(animate);
    setFrameTimeData();
}
