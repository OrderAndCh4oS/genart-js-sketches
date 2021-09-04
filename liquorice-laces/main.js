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
    iteration = 0,
    darkMode = false,
    darkBackground = '#FF4100',
    lightBackground = '#E8E5D7',
    colours = ['#16130c', '#FF4100'],
    radius = 25,
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
    dampingYB,
    amplitudeXAStep,
    amplitudeYAStep,
    amplitudeXBStep,
    amplitudeYBStep
;

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    colours = darkMode ? ['#E8E5D7', '#16130c'] : ['#FF4100', '#16130c'];
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
    frequencyXA = Math.random() * 0.9 + 0.05;
    frequencyXB = Math.random() * 0.9 + 0.05;
    frequencyYA = Math.random() * 0.9 + 0.05;
    frequencyYB = Math.random() * 0.9 + 0.05;
    phaseXA = (Math.random() * 40) + width / 6;
    phaseXB = (Math.random() * 40) + width / 6;
    phaseYA = (Math.random() * 40) + height / 6;
    phaseYB = (Math.random() * 40) + height / 6;
    amplitudeXA = (Math.random() * 40) + width / 6;
    amplitudeXB = (Math.random() * 40) + width / 6;
    amplitudeYA = (Math.random() * 40) + height / 6;
    amplitudeYB = (Math.random() * 40) + height / 6;
    dampingXA = (Math.random() * 0.0095) + 0.0005;
    dampingXB = (Math.random() * 0.0095) + 0.0005;
    dampingYA = (Math.random() * 0.0095) + 0.0005;
    dampingYB = (Math.random() * 0.0095) + 0.0005;
    amplitudeXAStep = Math.random() * 40 - 20;
    amplitudeYAStep = Math.random() * 40 - 20;
    amplitudeXBStep = Math.random() * 40 - 20;
    amplitudeYBStep = Math.random() * 40 - 20;

    while(Math.abs(frequencyXA - frequencyXB) < 0.2) {
        frequencyXB = Math.random();
    }

    while(Math.abs(frequencyYA - frequencyYB) < 0.2) {
        frequencyYB = Math.random();
    }

}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function clampValue(value, min, max) {
    const mod = max - min;
    return (value % mod) + min;
}

function update() {
    context.clearRect(0, 0, width, height);
    context.lineCap = 'round';
    context.lineWidth = 32;
    context.lineJoin = 'round';
    for(let i = 0; i < 9; i++) {
        context.strokeStyle = colours[i % colours.length];
        const steppedAmplitudeXA = amplitudeXA + amplitudeXAStep * i;
        const steppedAmplitudeYA = amplitudeYA + amplitudeYAStep * i;
        const steppedAmplitudeXB = amplitudeXB + amplitudeXBStep * i;
        const steppedAmplitudeYB = amplitudeYB + amplitudeYBStep * i;
        const tempPhaseXA = width / 6 + sinWave(phaseXA  + iteration, 0.003, 40);
        const tempPhaseXB = width / 6 + sinWave(phaseXB  + iteration, 0.003, 40);
        const tempPhaseYA = height / 6 + sinWave(phaseYA  + iteration, 0.003, 40);
        const tempPhaseYB = height / 6 + sinWave(phaseYB  + iteration, 0.003, 40);
        const tempDampingXA = 0.0005 + sinWave(dampingXA  + iteration, 0.03, 0.0095);
        const tempDampingXB = 0.0005 + sinWave(dampingXA  + iteration, 0.03, 0.0095);
        const tempDampingYA = 0.0005 + sinWave(dampingXA  + iteration, 0.03, 0.0095);
        const tempDampingYB = 0.0005 + sinWave(dampingXA  + iteration, 0.03, 0.0095);

        squiggle(
            frequencyXA, tempPhaseXA, steppedAmplitudeXA, tempDampingXA,
            frequencyXB, tempPhaseXB, steppedAmplitudeXB, tempDampingXB,
            frequencyYA, tempPhaseYA, steppedAmplitudeYA, tempDampingYA,
            frequencyYB, tempPhaseYB, steppedAmplitudeYB, tempDampingYB,
        );
    }
    iteration++;
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
    const xA = new Harmonograph(frequencyXA, phaseXA, amplitudeXA, dampingXA);
    const xB = new Harmonograph(frequencyXB, phaseXB, amplitudeXB, dampingXB);
    const yA = new Harmonograph(frequencyYA, phaseYA, amplitudeYA, dampingYA);
    const yB = new Harmonograph(frequencyYB, phaseYB, amplitudeYB, dampingYB);
    let scale = 1;
    const points = [];
    let i = 0;
    for(; i < 200; i++) {
        const x = xA.getValue(i / 10) + xB.getValue(i / 10);
        const y = yA.getValue(i / 10) + yB.getValue(i / 10);
        points.push(new Point(width / 2 + x, height / 2 + y));
    }

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for(let j = 1; j < points.length; j++) {
        let p = points[j];
        context.lineTo(p.x, p.y);
        scale *= 0.9999;
    }
    context.stroke();
}

function sinWave(t, speed, scale = 1) {
    return Math.abs(Math.sin(t * speed)) * scale;
}
