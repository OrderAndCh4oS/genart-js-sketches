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
    currentColour = 0,
    coloursAlpha = ['rgba(232,229,215,0.2)', 'rgba(22,19,12,0.2)'],
    growthPatterns,
    iteration = 0
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
        toggleDarkMode();
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
    centre = new Point(width / 2, height / 2);
    context.clearRect(0, 0, width, height);
    const size = width * 0.05;
    const params = [0.012, 0.07, 0.07, 15, 250, 45, 500, 0.33];
    const growthPatternOne = new BezierLineGrowthPattern(...params);
    growthPatternOne.init(width + 50, height / 5, -50, height / 5, size);
    const growthPatternTwo = new BezierLineGrowthPattern(...params);
    growthPatternTwo.init(-50, centre.y, width + 50, centre.y, size);
    const growthPatternThree = new BezierLineGrowthPattern(...params);
    growthPatternThree.init(-50, height / 5 * 4, width + 50, height / 5 * 4, size);
    growthPatterns = [
        growthPatternOne,
        growthPatternTwo,
        growthPatternThree,
    ];
    iteration = 0;
}

function update() {
    if(darkMode) {
        if(iteration % 64 === 0) currentColour = (currentColour + 1) % coloursAlpha.length;
        for(let i = 0; i < growthPatterns.length; i++) {
            const growthPattern = growthPatterns[i];
            growthPattern.otherNodes = [...growthPatterns[(i + 1) % 3].nodes, ...growthPatterns[(i + 2) % 3].nodes];
            growthPattern.update();
            growthPattern.drawConnections(
                context,
                coloursAlpha[(currentColour + i) % coloursAlpha.length],
                1.5,
                'round',
            );
        }
    } else {
        for(let i = 0; i < growthPatterns.length; i++) {
            const growthPattern = growthPatterns[i];
            growthPattern.otherNodes = [...growthPatterns[(i + 1) % 3].nodes, ...growthPatterns[(i + 2) % 3].nodes];
             growthPattern.update();
            growthPattern.drawConnections(
                context,
                'rgba(22,19,12,0.15)',
                1,
                'round',
            );
            growthPattern.drawDots(
                context,
                '#FF4100',
                0.66,
            );
        }
    }

}
