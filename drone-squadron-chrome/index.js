import {
    audioHandler,
    background,
    canvas,
    debug,
    dm,
    game,
    grid,
    pm,
    restartButton,
    squadrons,
    startButton,
    stopButton,
} from './constants/constants.js';
import { deltaTime } from './service/delta-time.js';
import SquadronFactory from './factory/squadron-factory.js';
import UI from './user-interface/ui.js';
import GameOver from './user-interface/display-game-over.js';
import nDronesGenerator from './misc/n-drones-generator.js';
import nameGenerator from './misc/name-generator.js';

let fpsInterval, startTime, now, then, elapsed;

debug.initialiseListeners();

startButton.onclick = async function() {
    startButton.style.display = 'none';
    document.getElementById('debug-bar').style.display = 'flex';
    await initialise();
};

stopButton.onclick = () => {
    game.state = 'stopped';
    audioHandler.stop('music');
    startButton.style.display = 'block';
    document.getElementById('debug-bar').style.display = 'none';
};

window.onresize = async() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    background.update();
    background.draw();
    if(game.state !== 'stopped') {
        await initialise();
    }
};

window.onload = async() => {
    await audioHandler.setAudioFile('explosion', 'assets/audio/sound/explosion_1.wav');
    await audioHandler.setAudioFile('uzi', 'assets/audio/sound/uzi_1.wav');
    await audioHandler.setAudioFile('shotgun', 'assets/audio/sound/shotgun_1.wav');
    await audioHandler.setAudioFile('rifle', 'assets/audio/sound/rifle_1.wav');
    await audioHandler.setAudioFile('music', 'assets/audio/music/Urban-Future.mp3', 'audio/mpeg');
    startAnimating(60);
};

restartButton.onclick = async() => {
    await initialise();
};

async function initialise() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    audioHandler.play('music', 0.4, true);
    dm.init();
    pm.init();
    grid.init();
    game.state = 'playing';
    setupDrones();
}

function setupDrones() {
    squadrons.splice(0, squadrons.length);
    const drones = nDronesGenerator(~~(canvas.width * 0.009));
    [
        {
            id: 1, colour: 'white', name: 'Squadron ' + nameGenerator(),
            drones: drones.map((d, i) => ({id: i + 1, ...d})),
        },
        {
            id: 2, colour: 'black', name: 'Squadron ' + nameGenerator(),
            drones: drones.map((d, i) => ({id: i + drones.length + 1, ...d})),
        },
    ].map(s => squadrons.push(SquadronFactory.make(s)));
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
    if(game.state === 'playing' || game.state === 'game-over') {
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
    }
    if(game.state === 'game-over') {
        new GameOver().draw();
    }
    requestAnimationFrame(animate);
    setFrameTimeData();
}
