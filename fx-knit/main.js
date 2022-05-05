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
    space,
    spaceScale,
    context = canvas.getContext('2d'),
    points = [],
    a,
    b,
    c,
    d,
    m,
    sinOffOne,
    sinOffTwo,
    cosOffOne,
    cosOffTwo
;

width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 1, Ease.EASE_OUT);
const colourSet = colours[colourIndex];
const isDarkMode = fxrand() > 0.75;
const isColourBackground = fxrand() > 0.8;
const bwMod = isColourBackground ? 0.5 : 0;
const isBlackAndWhite = fxrand() + bwMod > 0.9;
const colour = colourSet.colours[~~(fxrand() *colourSet.colours)]
let strokeColours = isBlackAndWhite
    ? [!isDarkMode ? colourSet.white : colourSet.black]
    : [colour];
strokeColours.push(isDarkMode ? colourSet.white : colourSet.black);
let background = isColourBackground
    ? colour
    : isDarkMode
        ? colourSet.black
        : colourSet.white;
let dotColours = isColourBackground && !isBlackAndWhite ? [!isDarkMode ? colourSet.white : colourSet.black] : strokeColours

a = fxrand() * 6 - 3;
b = fxrand() * 6 - 3;
c = fxrand() * 4 - 2;
d = fxrand() * 4 - 2;

sinOffOne = fxrand() * 10 - 20;
sinOffTwo = fxrand() * 10 - 20;
cosOffOne = fxrand() * 10 - 20;
cosOffTwo = fxrand() * 10 - 20;

if(isColourBackground && !isBlackAndWhite) {
    strokeColours.shift()
}

window.$fxhashFeatures = {
    'Colour': colourSet.name,
    'Black & White': isBlackAndWhite,
    'Mode': isDarkMode ? 'Dark' : 'Light',
    'Colour Background': isColourBackground
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
    valueMod = diagonalLength / 168000;
    margin = diagonalLength * 0.02;
    strokeWeight = 12;
    length = diagonalLength * 0.009;
    space = diagonalLength / 112;
    spaceScale = 0.01 - ((diagonalLength / 800) * 0.0015);
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
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
    // context.fillStyle = background;
    // context.fillRect(0, 0, width, height);
    context.lineWidth = strokeWeight;
    const dots = [];
    for(let i = 0; i < points.length; i++) {
        const point = points[i];
        const value = getValue(point.x, point.y);
        point.vx += Math.cos(value) * (fxrand() * length + (length / 2));
        point.vy += Math.sin(value) * (fxrand() * length + (length / 2));
        context.strokeStyle = strokeColours[i % strokeColours.length];
        context.beginPath();
        context.moveTo(point.x, point.y);
        point.x += point.vx;
        point.y += point.vy;
        context.lineTo(point.x, point.y);
        context.stroke();
        dots.push({x: point.x, y: point.y});
        point.vx *= 0.85;
        point.vy *= 0.85;
    }
    for(let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        context.fillStyle = dotColours[(i + 1) % dotColours.length];
        context.beginPath();
        context.arc(dot.x, dot.y, 3, 0, TAU, true);
        context.fill();
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
    let m = ((fxrand() * 0.9) + 0.1);
    if(x < 0.01) xD = 1;
    else if(x > 5.99) xD = 0;
    if(xD === 0) m = -m;
    return [(x + m), xD];
}

function getValue(x, y) {
    x = (x - width / 2) * spaceScale;
    y = (y - height / 2) * spaceScale;

    const x1 = Math.sin((a - space) + sinOffOne * y) + (c - space) *
        Math.cos((a - space) + cosOffOne * x);
    const y1 = Math.sin((b - space) + sinOffTwo * x) + (d - space) *
        Math.cos((b - space) + cosOffTwo * y);

    return Math.atan2(y1 - y, x1 - x);
}
