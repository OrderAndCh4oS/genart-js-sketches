let diagonalLength,
    circleData = [],
    dotRadius,
    points = []
;

const {sqrt, cos, sin} = Math;

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
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
    diagonalLength = Math.sqrt(width * width + height * height);
    points.push(new Point(width / 2, height / 2));
    dotRadius = diagonalLength * 0.002;
}

function getRedAlpha(alpha) {
   return `rgba(255,65,0,${alpha})`;
}

function phyllotaxis(point, c, iteration) {
    const a = iteration * 137.5;
    const r = c * sqrt(iteration);
    point.x += r * cos(a);
    point.y += r * sin(a);
}

function drawCircle(point) {
    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(point.x, point.y, dotRadius, 0, TAU, true);
    context.fill();
}

function update() {
    // context.clearRect(0, 0, width, height);
    for(let i = 0; i < points.length; i++){
            const point = points[i];
            drawCircle(point);
            phyllotaxis(point, 6, iteration);
    }
}
