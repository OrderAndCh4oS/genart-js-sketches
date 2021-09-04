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
    iteration = 0,
    darkMode = true,
    darkBackground = '#FF4100',
    lightBackground = '#E8E5D7',
    colours = ['#E8E5D7', '#16130c'],
    radius = 25,
    frequencyXABase,
    frequencyXBBase,
    frequencyYABase,
    frequencyYBBase,
    frequencyXA,
    phaseXA,
    amplitudeXA,
    dampingXA,
    frequencyXB,
    phaseXB,
    amplitudeXB,
    dampingXB,
    frequencyYA,
    phaseYA,
    amplitudeYA,
    dampingYA,
    frequencyYB,
    phaseYB,
    amplitudeYB,
    dampingYB
;

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    colours = darkMode ? ['#E8E5D7', '#16130c'] : ['#E8E5D7', '#FF4100', '#16130c'];
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
    frequencyXABase = (Math.random() * 3);
    frequencyXBBase = (Math.random() * 3);
    frequencyYABase = (Math.random() * 3);
    frequencyYBBase = (Math.random() * 3);
    phaseXA = (Math.random() * 40) + width / 3;
    amplitudeXA = (Math.random() * 40) + width / 3;
    dampingXA = (Math.random() * 0.0995) + 0.0005;
    phaseXB = (Math.random() * 40) + width / 3;
    amplitudeXB = (Math.random() * 40) + width / 3;
    dampingXB = (Math.random() * 0.0995) + 0.0005;
    phaseYA = (Math.random() * 40) + height / 3;
    amplitudeYA = (Math.random() * 40) + height / 3;
    dampingYA = (Math.random() * 0.0995) + 0.0005;
    phaseYB = (Math.random() * 40) + height / 3;
    amplitudeYB = (Math.random() * 40) + height / 3;
    dampingYB = (Math.random() * 0.0995) + 0.0005;
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
    squiggle(
        frequencyXA, phaseXA, amplitudeXA, dampingXA,
        frequencyXB, phaseXB, amplitudeXB, dampingXB,
        frequencyYA, phaseYA, amplitudeYA, dampingYA,
        frequencyYB, phaseYB, amplitudeYB, dampingYB,
    );
    iteration++;
    frequencyXA = sinWave(frequencyXABase + iteration * 0.01, 3);
    frequencyXB = sinWave(frequencyXBBase + iteration * 0.015, 3);
    frequencyYA = sinWave(frequencyYABase + iteration * 0.0125, 3);
    frequencyYB = sinWave(frequencyYBBase + iteration * 0.0175, 3);
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

function squiggle(
    frequencyXA, phaseXA, amplitudeXA, dampingXA,
    frequencyXB, phaseXB, amplitudeXB, dampingXB,
    frequencyYA, phaseYA, amplitudeYA, dampingYA,
    frequencyYB, phaseYB, amplitudeYB, dampingYB,
) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const xA = new Harmonograph(frequencyXA, phaseXA, amplitudeXA, dampingXA);
    const xB = new Harmonograph(frequencyXB, phaseXB, amplitudeXB, dampingXB);
    const yA = new Harmonograph(frequencyYA, phaseYA, amplitudeYA, dampingYA);
    const yB = new Harmonograph(frequencyYB, phaseYB, amplitudeYB, dampingYB);
    let scale = 1;
    const points = [];
    let lastPoint = null;
    let i = 0;

    for(; i < 50; i++) {
        const x = xA.getValue(i) + xB.getValue(i);
        const y = yA.getValue(i) + yB.getValue(i);
        if(lastPoint === null) {
            lastPoint = new Point(x, y);
            continue;
        }
        let t = 1;
        for(; t >= 0; t -= 1 / 45) {
            points.push(Bezier.cubicBezier(
                new Point(x, y),
                new Point(x, lastPoint.y),
                new Point(lastPoint.x, y),
                new Point(lastPoint.x, lastPoint.y),
                t,
            ));
        }
        lastPoint = new Point(x, y);
    }

    let colourStep = 0;
    let colour = colours[0];
    for(let j = 0; j < points.length; j++) {
        let p = points[j];
        if(j % 25 === 0) {
            colourStep = (colourStep + 1) % colours.length;
            colour = colours[colourStep];
        }
        context.fillStyle = colour;
        context.beginPath();
        context.arc((width / 2) + p.x, (height / 2) + p.y, 100 * scale + 1, 0, TAU, true);
        context.fill();
        scale *= 0.9991;
    }
}

function sinWave(t, scale) {
    return (Math.abs(Math.sin(t)) / TAU) * scale;
}
