const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
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
    centre,
    width,
    height,
    diagonalLength,
    valueMod,
    margin,
    strokeWeight,
    length,
    context = canvas.getContext('2d'),
    points = [],
    aD = 1,
    bD = 0,
    cD = 1,
    dD = 0,
    a,
    b,
    c,
    d,
    m
;

width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 1, Ease.EASE_OUT);
const colourSet = colours[colourIndex];
let selectedColours = [shuffle(colourSet.colours)[0]];
selectedColours.push(colourSet.white);
selectedColours.push(colourSet.black);
const isDarkMode = fxrand() > 0.5;
const isBlackAndWhite = fxrand() > 0.2;
const isColourBackground = isBlackAndWhite && fxrand() > 0.85;
let background = isColourBackground
    ? selectedColours[0]
    : isDarkMode
        ? colourSet.black
        : colourSet.white;

a = fxrand() * 6 - 3;
b = fxrand() * 6 - 3;
c = fxrand() * 4 - 2;
d = fxrand() * 4 - 2;

if(isBlackAndWhite) {
    selectedColours = [colourSet.white, colourSet.black];
}

window.$fxhashFeatures = {
    'Colour': colourSet.name,
    'Black & White': isBlackAndWhite,
    'Mode': isColourBackground ? 'Colour' : isDarkMode ? 'Dark' : 'Light',
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
    margin = diagonalLength * 0.02;
    strokeWeight = diagonalLength * 0.038;
    length = diagonalLength * 0.009;
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    aD = 1;
    bD = 0;
    cD = 1;
    dD = 0;
    points = [];
    for(let i = 0; i < 100; i += 1) {
        points.push({
            x: (fxrand() * (width - margin)) + margin / 2,
            y: (fxrand() * (height - margin)) + margin / 2,
            vx: 0,
            vy: 0
        });
    }
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    [a, aD] = calc(a, aD);
    [b, bD] = calc(b, bD);
    [c, cD] = calc(c, cD);
    [d, dD] = calc(d, dD);

    context.lineWidth = strokeWeight;

    for(let i = 0; i < points.length; i++) {
        const point = points[i];
        const value = getValue(point.x, point.y);
        point.vx += Math.cos(value) * (fxrand() * length + (length / 2));
        point.vy += Math.sin(value) * (fxrand() * length + (length / 2));
        context.strokeStyle = selectedColours[i % selectedColours.length];
        context.beginPath();
        context.moveTo(point.x, point.y);
        point.x += point.vx;
        point.y += point.vy;
        context.lineTo(point.x, point.y);
        context.stroke();
        point.vx *= 0.8;
        point.vy *= 0.8;
    }
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

function calc(x, xD) {
    let m = (fxrand() * 0.9) + 0.1;
    if(x < 0.01) xD = 1;
    else if(x > 5.99) xD = 0;
    if(xD === 0) m = -m;
    return [(x + m), xD];
}

function getValue(x, y) {
    x = (x - width / 2) * 0.0078;
    y = (y - height / 2) * 0.0078;

    const x1 = Math.sin((a - 4) * y) + (c - 4) * Math.cos((a - 4) * x);
    const y1 = Math.sin((b - 4) * x) + (d - 4) * Math.cos((b - 4) * y);

    return Math.atan2(y1 - y, x1 - x);
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
