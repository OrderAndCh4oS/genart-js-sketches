const TAU = Math.PI * 2;
const rand = Math.random;
const colours = ['#FF4100', '#16130c']
const darkColours = ['#16130c', '#E8E5D7']
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
    strokeWidth,
    currentColours,
    mode = 0,
    darkMode = false
;

window.onclick = function(event) {
    darkMode = !darkMode;
    initialise();
    update();
};

window.onkeyup = function(e) {
    if(e.code === 'Space') {
        play = !play;
    }
    if(e.code === 'KeyM') {
        mode = (mode + 1) % 3
        initialise();
        update();
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
    const r = 0.012 * diagonalLength;
    const offset = 0.06 * diagonalLength;
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
    if(darkMode) {
        currentColours = darkColours
        context.fillStyle = mode === 0 ? '#FF4100' : mode === 1 ? '#16130c' : '#E8E5D7';
    } else {
        currentColours = colours
        context.fillStyle = mode === 0 ? '#E8E5D7' : '#FF4100';
    }
    context.fillRect(0, 0, width, height);
    currentColourIndex = 0;
    radius = 0.004 * diagonalLength;
    strokeWidth = 0.003   * diagonalLength;
    context.translate(width / 2, height / 2);
    iteration = 0;
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function drawDot(x, y) {
    context.beginPath();
    context.arc(x, y, radius, 0, TAU, true);
    context.fill();
}

function drawLine(xA, yA, xB, yB) {
    context.beginPath();
    context.moveTo(xA, yA);
    context.lineTo(xB, yB);
    context.stroke();
}

function drawModeOne() {
    context.fillStyle = darkMode ? '#FF4100' : '#E8E5D7';
    context.fillRect(-(width / 2), -(height / 2), width, height);
    context.fillStyle = currentColours[currentColourIndex % colours.length];
    context.strokeStyle = currentColours[(currentColourIndex + 1) % colours.length];
    context.lineWidth = strokeWidth;
    context.lineCap = 'round';

    for (let i = 0; i < arms.length - 2; i += 2) {
        const armOne = arms[i];
        const armTwo = arms[i + 1];
        const armThree = arms[i + 2];
        drawLine(armTwo.x, armTwo.y, armThree.x, armThree.y);
        drawDot(armOne.x, armOne.y);
        drawDot(armTwo.x, armTwo.y);
        drawLine(armOne.x, armOne.y, armTwo.x, armTwo.y);
    }

    const lastOne = arms.at(-2);
    const lastTwo = arms.at(-1);
    drawDot(lastOne.x, lastOne.y);
    drawDot(lastTwo.x, lastTwo.y);
    drawLine(lastOne.x, lastOne.y, lastTwo.x, lastTwo.y);
}

function drawModeTwo() {
    context.strokeStyle = darkMode ? '#E8E5D7' : '#16130c';
    context.fillStyle = darkMode ? '#16130c' : '#E8E5D7';
    context.lineWidth = strokeWidth;

    for (let i = 0; i < arms.length; i++) {
        const arm = arms[i];
        context.beginPath();
        context.arc(arm.x, arm.y, radius, 0, TAU, true);
        context.fill();
        context.stroke();
    }
}

function drawModeThree() {
    context.fillStyle = darkMode ? '#FF4100' : '#E8E5D7';
    context.fillRect(-(width / 2), -(height / 2), width, height);

    context.fillStyle = '#16130c';

    for (let i = 0; i < arms.length; i++) {
        if(darkMode)
            context.fillStyle = i % 2 === 0 ? '#16130c' : '#E8E5D7';

        const arm = arms[i];
        context.beginPath();
        context.arc(arm.x, arm.y, radius, 0, TAU, true);
        context.fill();
    }
}

function update() {
    if(mode === 0) drawModeOne();
    if(mode === 1) drawModeTwo();
    if(mode === 2) drawModeThree();
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
    const frequencyXA = rand() * 0.9 + 0.05;
    const frequencyXB = rand() * 0.9 + 0.05;
    const frequencyYA = rand() * 0.9 + 0.05;
    const frequencyYB = rand() * 0.9 + 0.05;
    const phaseXA = (((rand() * 125) + 100) * diagonalLength) / 555;
    const phaseXB = (((rand() * 125) + 100) * diagonalLength) / 555;
    const phaseYA = (((rand() * 125) + 100) * diagonalLength) / 666;
    const phaseYB = (((rand() * 125) + 100) * diagonalLength) / 666;
    const amplitudeXA = (((rand() * 125) + 100) * diagonalLength) / 555;
    const amplitudeXB = (((rand() * 125) + 100) * diagonalLength) / 555;
    const amplitudeYA = (((rand() * 125) + 100) * diagonalLength) / 666;
    const amplitudeYB = (((rand() * 125) + 100) * diagonalLength) / 666;
    const dampingXA = (rand() * 0.00095) + 0.00005;
    const dampingXB = (rand() * 0.00095) + 0.00005;
    const dampingYA = (rand() * 0.00095) + 0.00005;
    const dampingYB = (rand() * 0.00095) + 0.00005;
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
    };
}
