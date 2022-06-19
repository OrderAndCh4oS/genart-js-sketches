const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    throttled = false,
    timeout = null,
    width,
    height,
    centre,
    fpsInterval,
    now,
    elapsed,
    then,
    fps = 30,
    startTime,
    play = true,
    growthPatterns,
    iteration = 0,
    currentColour = 0,
    selectedColoursLength
;

width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.9, Ease.EASE_OUT);
const colourSet = colours[colourIndex];
const mode = fxrand();
const darkMode = mode > 0.425;
const blackAndWhite = mode > 0.85;
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

selectedColoursLength = selectedColours.length;

window.$fxhashFeatures = {
    'Colour': colourSet.name,
    'Mode': blackAndWhite
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

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
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

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centre = new Point(width / 2, height / 2);
    context.clearRect(0, 0, width, height);
    const params = [0.675, 0.425, 0.425, 4, 45, 200, 0.33];
    growthPatterns = [];
    for(let i = 0; i < 4; i++) {
        const growthPattern = new BezierLineGrowthPattern(...params);
        growthPattern.init(width, height, 50);
        growthPatterns.push(growthPattern);
    }
    iteration = 0;
    canvas.style.backgroundColor = background;
    context.fillStyle = background;
    context.rect(0, 0, width, height);
    context.fill();
}

function update() {
    context.globalAlpha = 0.1;
    for(let i = 0; i < growthPatterns.length; i++) {
        const growthPattern = growthPatterns[i];
        growthPattern.update();

        growthPattern.drawConnections(
            context,
            selectedColours[(currentColour + i) % selectedColoursLength],
            0.5
        );

        growthPattern.drawDots(
            context,
            selectedColours[(currentColour + i + 1) % selectedColoursLength],
            0.33
        );
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
