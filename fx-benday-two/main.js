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
    x,
    y,
    endX,
    endY
;

const colourSet = colours[~~(fxrand() * colours.length)];
const allColours = shuffle([...colourSet.colours, colourSet.white, colourSet.black]);

window.$fxhashFeatures = {
    'Colour': colourSet.name,
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
    margin = diagonalLength * 0.25;
    context.fillStyle = allColours[0];
    context.fillRect(0, 0, width, height);
    context.fillStyle = allColours[1];
    drawBenDayDots(
        0,
        0,
        width,
        height,
        6,
        fxrand() * 0.3 + 0.15,
        context
    );
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    for(let i = 0; i < 6; i++) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(
            (fxrand() * (width - margin)) + (margin / 2),
            (fxrand() * (height - margin)) + (margin / 2)
        );
        for(let j = 0; j < 5; j++) {
            context.fillStyle = allColours[~~(fxrand() * allColours.length)];
            context.rotate(fxrand() * TAU);
            x = diagonalLength * (fxrand() * 0.048 + 0.018);
            y = diagonalLength * (fxrand() * 0.048 + 0.018);
            endX = x * 2;
            endY = y * 2;
            drawBenDayDots(
                -x,
                -y,
                endX,
                endY,
                3,
                fxrand() * 0.45 + 0.05,
                context
            );
        }
    }
    if(iteration === 111 && isFxpreview) fxpreview();
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

function drawBenDayDots(xStart, yStart, w, h, diameter, scale, context) {
    let rowIndex = 0;
    const xEnd = xStart + w + diameter;
    for(let x = xStart - diameter; x < xEnd; x += diameter) {
        const yEnd = yStart + h + diameter + (diameter / 2);
        for(let y = yStart + (rowIndex % 2 === 0 ? 0 : -(diameter / 2)); y <
        yEnd; y += diameter) {
            context.beginPath();
            context.ellipse(x, y, diameter * scale, diameter * scale, 0, 0, TAU);
            context.fill();
        }
        rowIndex++;
    }
}

function shuffle(arr) {
    let randomizedArray = [];
    let array = arr;
    while(array.length !== 0) {
        let rIndex = Math.floor(array.length * fxrand());
        randomizedArray.push(array[rIndex]);
        array.splice(rIndex, 1);
    }
    return randomizedArray;
}
