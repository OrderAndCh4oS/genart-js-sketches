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
    context = canvas.getContext('2d'),
    wave
;

width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 1, Ease.EASE_OUT);
const colourSet = colours[colourIndex];
let selectedColours = shuffle(colourSet.colours);
let background = colourSet.black;
const isBlackAndWhite = fxrand() > 0.66;
const step = ~~(fxrand() * 6) + 3;
const depth = [TAU * 0.2, TAU * 0.4, TAU * 0.6, TAU * 0.8][~~(fxrand() * 4)];
let waveCount = ~~(10 * fxrand()) + 3;
const maxRadius = (1 - (waveCount / 13)) * 60 + 20;
const waveHeight = [20, 25, 30, 35, 40][~~(fxrand() * 5)];
const dotGap = ~~(fxrand() * 5) + 4;
const aperture = [5, 15, 25, 35, 45][~~(fxrand() * 5)];

if(colourSet.name === 'Constructivist') {
    selectedColours.push(colourSet.white);
    selectedColours.push(colourSet.black);
}

if(isBlackAndWhite) {
    selectedColours = [colourSet.white, colourSet.black];
    if(waveCount % 2 !== 0) waveCount += 1;
}

window.$fxhashFeatures = {
    'Colour': colourSet.name,
    'Step': step,
    'Wave Count': waveCount,
    'Wave Height': waveHeight,
    'Depth': depth.toFixed(3),
    'Dot Gap': dotGap,
    'Aperture': aperture,
    'Black & White': isBlackAndWhite
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
    wave = new Wave(
        new Point(0, aperture),
        Math.PI / 24,
        step,
        height * 1.5,
        waveHeight
    );
    context.translate(width / 2, height / 2);
    context.clearRect(-(width / 2), -(height / 2), width, height);
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function getXY(point, angle) {
    let oldX = point.x;
    let oldY = point.y;
    const x1 = oldX * Math.cos(angle) - oldY * Math.sin(angle);
    const y1 = oldY * Math.cos(angle) + oldX * Math.sin(angle);
    return {x1, y1};
}

function update() {
    context.fillStyle = background;
    context.fillRect(-(width / 2), -(height / 2), width, height);
    iteration++;
    const points = wave.points;
    const angleMod = TAU / waveCount;
    for(let i = 0; i < waveCount; i++) {
        context.fillStyle = selectedColours[(i + 1) % selectedColours.length];
        const region = new Path2D();
        let angle = angleMod * i;
        const {x1, y1} = getXY(points[0], angle);
        region.moveTo(x1, y1);
        for(const point of points) {
            const {x1, y1} = getXY(point, angle);
            region.lineTo(x1, y1);
        }
        angle += angleMod - 0.00001;
        for(let i = points.length - 1; i >= 0; i--) {
            const {x1, y1} = getXY(points[i], angle);
            region.lineTo(x1, y1);
        }
        region.lineTo(x1, y1);
        region.closePath();
        context.fill(region);
        context.fillStyle = selectedColours[i % selectedColours.length];
        angle -= angleMod / 2;
        for(let i = 0; i < points.length; i += dotGap) {
            if(i > points.length) break;
            const {x1, y1} = getXY(points[i], angle);
            const d = Math.sqrt(x1 * x1 + y1 * y1) / height * 1.5;
            context.beginPath();
            context.arc(x1, y1, maxRadius * d, 0, TAU, true);
            context.fill();
        }
    }
    wave.update(12);
}

function render() {
    requestAnimationFrame(render);
    now = Date.now();
    elapsed = now - then;
    if(elapsed <= fpsInterval) return;
    then = now - (elapsed % fpsInterval);
    if(!play) return;
    update();
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
