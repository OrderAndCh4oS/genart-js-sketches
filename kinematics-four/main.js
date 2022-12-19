const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 24,
    play = true,
    iteration = 0,
    throttled = false,
    timeout = null,
    width,
    height,
    diagonalLength,
    arms,
    x,
    y,
    currentColourIndex,
    radius,
    values,
    strokeWidth
;

const colourSet = colours[~~(fxrand() * colours.length)];
const allColours = shuffle(
    [...colourSet.colours]);

window.$fxhashFeatures = {
    'Colour': colourSet.name
};

window.onclick = function(event) {
    initialise();
    update();
};

window.onkeyup = function(e) {
    if(e.code === 'Space') {
        play = !play;
    }
};

window.onresize = function() {
    clearTimeout(timeout);
    timeout = setTimeout(resizeHandler, 100);
    if(throttled) return;
    resizeHandler();
    throttled = true;
    setTimeout(function() {
        throttled = false;
    }, 250);
};

window.onload = function() {
    initialise();
    startAnimating();
};

function resizeHandler() {
    initialise();
    update();
}

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    diagonalLength = Math.sqrt(width * width + height * height);
    values = getValues();
    arms = [];
    const r = 0.015 * diagonalLength
    const offset = 0.08 * diagonalLength
    arms.push(new KinematicArm(0, -offset, r, 0));
    for(let i = 1; i < 1024; i++) {
        arms.push(new KinematicArm(
            arms[i - 1].getEndX(),
            arms[i - 1].getEndY(),
            r,
            arms[i - 1].angle + 0.15
        ));
        arms[i].parent = arms[i - 1];
    }
    x = arms.at(-1).getEndX();
    y = arms.at(-1).getEndY();
    context.fillStyle = colourSet.white;
    context.fillRect(0, 0, width, height);
    currentColourIndex = 0;
    radius = 0.005 * diagonalLength;
    strokeWidth = 0.0001 * diagonalLength;
    context.translate(width / 2, height / 2);
    iteration = 0;
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    // context.globalCompositeOperation = 'multiply';

    context.fillStyle = colourSet.white;
    context.fillRect(-(width / 2), -(height / 2), width, height);

    if(iteration % 50 === 0) {
        currentColourIndex++;
    }
    // context.fillStyle = allColours[currentColourIndex % allColours.length];
    // context.strokeStyle = colourSet.black;
    // context.lineWidth = strokeWidth;
    context.fillStyle = colourSet.black;

    for(let i = 0; i < arms.length; i++) {
        const arm = arms[i];
        context.beginPath();
        context.arc(arm.x, arm.y, radius, 0, TAU, true);
        context.fill();
    }
    const lastArm = arms.at(-1);
    const {
        frequencyXA, phaseXA, amplitudeXA, dampingXA,
        frequencyXB, phaseXB, amplitudeXB, dampingXB,
        frequencyYA, phaseYA, amplitudeYA, dampingYA,
        frequencyYB, phaseYB, amplitudeYB, dampingYB
    } = values;
    const xA = new Harmonograph(frequencyXA, phaseXA, amplitudeXA, dampingXA);
    const xB = new Harmonograph(frequencyXB, phaseXB, amplitudeXB, dampingXB);
    const yA = new Harmonograph(frequencyYA, phaseYA, amplitudeYA, dampingYA);
    const yB = new Harmonograph(frequencyYB, phaseYB, amplitudeYB, dampingYB);
    let i = iteration * 3;
    const x = xA.getValue(i / 30) + xB.getValue(i / 30);
    const y = yA.getValue(i / 30) + yB.getValue(i / 30);
    lastArm.drag(x, y);
}

function render() {
    requestAnimationFrame(render);
    now = Date.now();
    elapsed = now - then;
    if(elapsed <= fpsInterval) return;
    then = now - (elapsed % fpsInterval);
    if(!play) return;
    update();
    iteration++;
}

function shuffle(arr) {
    let randomizedArray = [];
    let array = arr;
    while(array.length !== 0) {
        let rIndex = Math.floor(array.length * Math.random());
        randomizedArray.push(array[rIndex]);
        array.splice(rIndex, 1);
    }
    return randomizedArray;
}

function getValues() {
    const frequencyXA = fxrand() * 0.9 + 0.05;
    const frequencyXB = fxrand() * 0.9 + 0.05;
    const frequencyYA = fxrand() * 0.9 + 0.05;
    const frequencyYB = fxrand() * 0.9 + 0.05;
    const phaseXA = (((fxrand() * 125) + 100) * diagonalLength) / 600;
    const phaseXB = (((fxrand() * 125) + 100) * diagonalLength) / 600;
    const phaseYA = (((fxrand() * 125) + 100) * diagonalLength) / 900;
    const phaseYB = (((fxrand() * 125) + 100) * diagonalLength) / 900;
    const amplitudeXA = (((fxrand() * 125) + 100) * diagonalLength) / 600;
    const amplitudeXB = (((fxrand() * 125) + 100) * diagonalLength) / 600;
    const amplitudeYA = (((fxrand() * 125) + 100) * diagonalLength) / 900;
    const amplitudeYB = (((fxrand() * 125) + 100) * diagonalLength) / 900;
    const dampingXA = (fxrand() * 0.00095) + 0.00005;
    const dampingXB = (fxrand() * 0.00095) + 0.00005;
    const dampingYA = (fxrand() * 0.00095) + 0.00005;
    const dampingYB = (fxrand() * 0.00095) + 0.00005;
    return {
        frequencyXA,
        frequencyXB,
        frequencyYA,
        frequencyYB,
        phaseXA,
        phaseXB,
        phaseYA,
        phaseYB,
        amplitudeXA,
        amplitudeXB,
        amplitudeYA,
        amplitudeYB,
        dampingXA,
        dampingXB,
        dampingYA,
        dampingYB
    }
}
