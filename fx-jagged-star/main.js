const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 12,
    play = false,
    iteration = 0,
    throttled = false,
    timeout = null,
    centre,
    width,
    height,
    count = 20,
    radius = 50,
    scale,
    ratio = 1.5,
    strokeWidth
;

width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.9, Ease.EASE_OUT);
const colourSet = colours[colourIndex];
const isDarkMode = fxrand() > 0.66;
const selectedColours = shuffle([...colourSet.colours.splice(0, 2), colourSet.white]);
let background = isDarkMode
        ? colourSet.black
        : colourSet.white;

window.$fxhashFeatures = {
    'Colour': colourSet.name,
    'Mode': isDarkMode ? 'Dark' : 'Light'
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
    scale = diagonalLength * 0.00007;
    strokeWidth = diagonalLength * 0.0005
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    drawShapes(scale * 1.5, selectedColours[0], colourSet.black);
    drawShapes(scale, selectedColours[1], colourSet.black);
    drawShapes(scale * 0.5, selectedColours[2], colourSet.black);
}

function render() {
    requestAnimationFrame(render);
    now = Date.now();
    elapsed = now - then;
    if(elapsed <= fpsInterval) return;
    then = now - (elapsed % fpsInterval);
    if(!play && iteration > 0) return;
    update();
    iteration++;
}

function drawShapes(scale, fillColour, strokeColour) {
    const values = Array(count).fill(0).map(() => fxrand());
    context.fillStyle = fillColour;
    context.strokeStyle = strokeColour;
    context.lineWidth = strokeWidth;
    for(let i = 100; i > 0; i--) {
        const start = Ellipse.getEllipsePoint(
            width / 2,
            height / 2,
            (radius * (i * scale)) * values[0],
            ((radius * ratio * i) * scale) * values[0],
            0
        );
        context.beginPath();
        context.moveTo(start.x(), start.y());
        for(let j = 1; j < count; j++) {
            const t = TAU / count * j;
            const point = Ellipse.getEllipsePoint(
                width / 2,
                height / 2,
                (radius * (i * scale)) * values[j],
                (radius * ratio * (i * scale)) * values[j],
                t
            );
            context.lineTo(point.x(), point.y());
        }
        context.closePath();
        context.fill();
        context.stroke();
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
