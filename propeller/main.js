let diagonalLength,
    circleData = [],
    trailCount,
    circleCount,
    scaleStep,
    speedStep,
    dotRadius
;

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
    circleData = [];
    if(darkMode) {
        trailCount = 24;
        circleCount = 40;
        scaleStep = diagonalLength * 0.000015;
        console.log(scaleStep)
        speedStep = 0.01;
        dotRadius = ~~(diagonalLength * 0.007)
    } else {
        trailCount = 32;
        circleCount = 80;
        scaleStep = diagonalLength * 7.5E-6;
        speedStep = 0.005;
        dotRadius = ~~(diagonalLength * 0.0035)
    }
    for(let i = 0; i < circleCount; i++) {
        circleData.push({
            r: (i * scaleStep) + scaleStep,
            speed: (circleCount - i) * speedStep,
            t: 0
        })
    }
}

function getRedAlpha(alpha) {
   return `rgba(255,65,0,${alpha})`;
}

function sinWave(t, scale) {
    return (Math.abs(Math.sin(t)) / TAU) * scale;
}

function drawCircle(circle) {
    const {r, speed} = circle;
    const radius = diagonalLength * r;
    let alpha = 1 / trailCount;
    for(let i = 0; i < trailCount; i++) {
        const colour = i === trailCount - 1 ? darkMode ? white : black : getRedAlpha(alpha);
        const point = Ellipse.getCirclePoint(width / 2, height / 2, radius, circle.t);
        context.fillStyle = colour;
        context.beginPath();
        context.arc(point.x, point.y, dotRadius, 0, TAU, true);
        context.fill();
        circle.t += sinWave(iteration * TAU / 64, speed);
        alpha += 1 / trailCount;
    }
}

function update() {
    context.clearRect(0, 0, width, height);
    for(const circle of circleData) {
        drawCircle(circle);
    }
}
