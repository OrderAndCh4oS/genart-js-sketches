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
    radius
;

const colourSet = colours[~~(fxrand() * colours.length)];
const allColours = shuffle(
    [...colourSet.colours, colourSet.white, colourSet.black]);

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
    arms = [];
    arms.push(new KinematicArm(width * 0.66, height * 0.33, 32, 0));
    for(let i = 1; i < 1024; i++) {
        arms.push(new KinematicArm(
            arms[i - 1].getEndX(),
            arms[i - 1].getEndY(),
            32,
            arms[i - 1].angle + 0.15
        ));
        arms[i].parent = arms[i - 1];
    }
    x = arms.at(-1).getEndX();
    y = arms.at(-1).getEndY();
    context.fillStyle = colourSet.black;
    context.fillRect(0, 0, width, height);
    currentColourIndex = 0;
    radius = 1;
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    // context.fillStyle = colourSet.black;
    // context.fillRect(0, 0, width, height);

    if(iteration % 50 === 0) {
        currentColourIndex++;
    }
    // context.fillStyle = allColours[currentColourIndex % allColours.length];
    context.fillStyle = colourSet.white;

    for(let i = 0; i < arms.length; i++) {
        const arm = arms[i];
        context.beginPath();
        context.arc(arm.x, arm.y, radius, 0, TAU, true);
        context.fill();
    }
    const lastArm = arms.at(-1);
    x -= 10;
    y -= 0.1;
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
