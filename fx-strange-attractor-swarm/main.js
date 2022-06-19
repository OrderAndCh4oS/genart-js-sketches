const TAU = Math.PI * 2;
const PI = Math.PI;
const pointCount = 5000;
let canvas = document.getElementById('canvas'),
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 30,
    play = true,
    iteration = 0,
    throttled = false,
    timeout = null,
    centre,
    width,
    height,
    diagonalLength,
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
    m,
    selectedColoursLength
;

width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.9, Ease.EASE_OUT);
const colourSet = colours[colourIndex];
const mode = fxrand();
const darkMode = mode > 0.4;
const blackAndWhite = mode > 0.8;
const blackAndWhitePure = mode > 0.9;
let background = darkMode
    ? colourSet.black
    : colourSet.white;
background = blackAndWhite
    ? colourSet.colours[~~(fxrand() * colourSet.colours.length)]
    : background;
document.body.style.backgroundColor = background;
let selectedColours = blackAndWhite
    ? [colourSet.white, colourSet.black]
    : shuffle([...colourSet.colours]);

if(blackAndWhitePure && mode >= 0.95) {
    selectedColours = [colourSet.white];
    background = colourSet.black;
}

if(blackAndWhitePure && mode < 0.95) {
    selectedColours = [colourSet.black];
    background = colourSet.white;
}

if(colourSet.name === 'Constructivist' && darkMode) {
    selectedColours.push(colourSet.white);
}

if(colourSet.name === 'Constructivist' && !darkMode) {
    selectedColours.push(colourSet.black);
}

selectedColoursLength = selectedColours.length;

a = fxrand() * 6 - 3;
b = fxrand() * 6 - 3;
c = fxrand() * 4 - 2;
d = fxrand() * 4 - 2;

window.$fxhashFeatures = {
    'Colour': colourSet.name,
    'Mode': blackAndWhitePure
        ? 'Pure Black & White'
        : blackAndWhite
            ? 'Black & White'
            : darkMode ? 'Dark' : 'Light'
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
    for(let i = 0; i < pointCount; i += 1) {
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
    context.globalAlpha = 0.075;
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 1;
    m = fxrand() * 0.02 + 0.01;
    if(a < 0.01) aD = 1;
    else if(a > 5.99) aD = 0;
    if(aD === 0) m = -m;
    a = (a + m);

    m = fxrand() * 0.02 + 0.01;
    if(b < 0.01) bD = 1;
    else if(b > 5.99) bD = 0;
    if(bD === 0) m = -m;
    b = (b + m);

    m = fxrand() * 0.02 + 0.01;
    if(c < 0.01) cD = 1;
    else if(c > 5.99) cD = 0;
    if(cD === 0) m = -m;
    c = (c + m);

    m = fxrand() * 0.02 + 0.01;
    if(d < 0.01) dD = 1;
    else if(d > 5.99) dD = 0;
    if(dD === 0) m = -m;
    d = (d + m);

    context.lineWidth = diagonalLength * 0.0015;

    for(let i = 0; i < pointCount; i++) {
        const value = getValue(points[i].x, points[i].y);
        points[i].vx += Math.cos(value) * 0.3;
        points[i].vy += Math.sin(value) * 0.3;
        const indexMod = i / pointCount;
        context.strokeStyle = selectedColours[~~(indexMod * selectedColoursLength) ];
        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        points[i].x += points[i].vx;
        points[i].y += points[i].vy;
        context.lineTo(points[i].x, points[i].y);
        context.stroke();
        points[i].vx *= 0.99;
        points[i].vy *= 0.99;
        if(points[i].x > width) points[i].x = 0;
        else if(points[i].x < 0) points[i].x = width;
        if(points[i].y > height) points[i].y = 0;
        else if(points[i].y < 0) points[i].y = height;
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
    x = (x - width / 2) * 0.004;
    y = (y - height / 2) * 0.004;

    var x1 = Math.sin((a - 3) * y) + (c - 3) * Math.cos((a - 3) * x);
    var y1 = Math.sin((b - 3) * x) + (d - 3) * Math.cos((b - 3) * y);

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
