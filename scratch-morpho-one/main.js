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
    fps = 24,
    startTime,
    play = true,
    darkMode = false,
    darkBackground = '#FF4100',
    lightBackground = '#E8E5D7',
    colours = ['#FF4100', '#16130c', '#E8E5D7'],
    radius = 0.66,
    growthPattern
;

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    colours = darkMode ? ['#E8E5D7', '#16130c', '#FF4100'] : ['#FF4100', '#16130c'];
    initialise();
    update();
}

window.onclick = function() {
    toggleDarkMode();
};

window.onkeyup = function(e) {
    if(e.code === 'Space') {
        play = !play;
    } else {
        // toggleDarkMode();
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

window.onmousemove = function(event) {
    // do nothing
};

function resizeHandler() {
    initialise();
    update();
}

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centre = new Point(width / 2, height / 2);
    context.clearRect(0, 0, width, height);
    const minDimension = Math.min(width, height);
    const params = [
        0.03,
        0.06,
        0.06,
        15,
        250,
        60,
        1500,
        0.333,
    ];
    if(darkMode) {
        growthPattern = new RectGrowthPattern(...params);
        const size = minDimension * 0.2;
        growthPattern.init(centre.x - size / 2, centre.y - size / 2, size, ~~(minDimension * 0.03));
    } else {
        growthPattern = new EllipseGrowthPattern(...params);
        const size = minDimension * 0.15;
        growthPattern.init(centre, size, ~~(minDimension * 0.03));
    }

}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = darkMode ? darkBackground : lightBackground;
    context.fillRect(0, 0, canvas.width, canvas.height);
    growthPattern.update();
    growthPattern.drawConnections(
        context,
        colours[0],
        colours[1],
        32,
        'round',
    );
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
