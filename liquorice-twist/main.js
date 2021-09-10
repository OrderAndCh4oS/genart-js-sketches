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
    iteration,
    darkMode = false,
    darkBackground = '#FF4100',
    lightBackground = '#E8E5D7',
    phaseXA,
    frequencyXA,
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
    amplitudeYBStep,
    frequencyXAStep,
    frequencyYAStep,
    frequencyXBStep,
    frequencyYBStep,
    currentColour
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

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centre = new Point(width / 2, height / 2);
    const scale = 4;
    frequencyXA = Math.random() * 0.9 + 0.05;
    frequencyXB = Math.random() * 0.9 + 0.05;
    frequencyYA = Math.random() * 0.9 + 0.05;
    frequencyYB = Math.random() * 0.9 + 0.05;
    phaseXA = (Math.random() * 80) + width / scale;
    phaseXB = (Math.random() * 80) + width / scale;
    phaseYA = (Math.random() * 80) + height / scale;
    phaseYB = (Math.random() * 80) + height / scale;
    amplitudeXA = (Math.random() * 80) + width / scale;
    amplitudeXB = (Math.random() * 80) + width / scale;
    amplitudeYA = (Math.random() * 80) + height / scale;
    amplitudeYB = (Math.random() * 80) + height / scale;
    dampingXA = (Math.random() * 0.0095) + 0.0005;
    dampingXB = (Math.random() * 0.0095) + 0.0005;
    dampingYA = (Math.random() * 0.0095) + 0.0005;
    dampingYB = (Math.random() * 0.0095) + 0.0005;
    amplitudeXAStep = Math.random() * 10 - 5;
    amplitudeYAStep = Math.random() * 10 - 5;
    amplitudeXBStep = Math.random() * 10 - 5;
    amplitudeYBStep = Math.random() * 10 - 5;
    frequencyXAStep = Math.random() * 0.3 - 0.15;
    frequencyYAStep = Math.random() * 0.3 - 0.15;
    frequencyXBStep = Math.random() * 0.3 - 0.15;
    frequencyYBStep = Math.random() * 0.3 - 0.15;

    while(Math.abs(frequencyXA - frequencyXB) < 0.2) {
        frequencyXB = Math.random();
    }

    while(Math.abs(frequencyYA - frequencyYB) < 0.2) {
        frequencyYB = Math.random();
    }

    iteration = 1;
    currentColour = 0;
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    // context.clearRect(0, 0, width, height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 0.5;
    let squiggles = [];
    const stepMod = 0.1;
    for(let i = 0; i < 2; i++) {
        const steppedAmplitudeXA = amplitudeXA + amplitudeXAStep * i;
        const steppedAmplitudeYA = amplitudeYA + amplitudeYAStep * i;
        const steppedAmplitudeXB = amplitudeXB + amplitudeXBStep * i;
        const steppedAmplitudeYB = amplitudeYB + amplitudeYBStep * i;
        const steppedFrequencyXA = frequencyXA + frequencyXAStep * i;
        const steppedFrequencyYA = frequencyYA + frequencyYAStep * i;
        const steppedFrequencyXB = frequencyXB + frequencyXBStep * i;
        const steppedFrequencyYB = frequencyYB + frequencyYBStep * i;
        const tempPhaseXA = width / 6 + sinWave(phaseXA + iteration * stepMod, 0.003, 40);
        const tempPhaseXB = width / 6 + sinWave(phaseXB + iteration * stepMod, 0.003, 40);
        const tempPhaseYA = height / 6 + sinWave(phaseYA + iteration * stepMod, 0.003, 40);
        const tempPhaseYB = height / 6 + sinWave(phaseYB + iteration * stepMod, 0.003, 40);
        const tempDampingXA = 0.0005 + sinWave(dampingXA + iteration * stepMod, 0.04, 0.0095);
        const tempDampingXB = 0.0005 + sinWave(dampingXA + iteration * stepMod, 0.04, 0.0095);
        const tempDampingYA = 0.0005 + sinWave(dampingXA + iteration * stepMod, 0.04, 0.0095);
        const tempDampingYB = 0.0005 + sinWave(dampingXA + iteration * stepMod, 0.04, 0.0095);
        squiggles.push(squiggle(
            steppedFrequencyXA, tempPhaseXA, steppedAmplitudeXA, tempDampingXA,
            steppedFrequencyXB, tempPhaseXB, steppedAmplitudeXB, tempDampingXB,
            steppedFrequencyYA, tempPhaseYA, steppedAmplitudeYA, tempDampingYA,
            steppedFrequencyYB, tempPhaseYB, steppedAmplitudeYB, tempDampingYB,
        ));
    }
    const allPoints = [...squiggles[0], ...squiggles[1]];
    const kdTree = new KdTree(allPoints);
    for(let i = 0; i < squiggles.length; i++) {
        const points = squiggles[i];
        if(darkMode) {
            context.strokeStyle = ['rgba(22,19,12,0.15)', 'rgba(232,229,215,0.15)'][(currentColour) % 2]
        } else {
            context.strokeStyle = ['rgba(255,65,0,0.15)',  'rgba(22,19,12,0.15)', 'rgba(232,229,215,0.15)'][(currentColour) % 3]
        }
        for(const point of points) {
            const knn = kdTree.findKnnInRadius(8, 850, point);
            context.beginPath();
            context.moveTo(point.x, point.y);
            for(const neighbour of knn) {
                context.lineTo(neighbour.x, neighbour.y);
            }
            context.stroke();
        }
    }
    if(iteration % 24 === 0) {
        currentColour = (currentColour + 1) % (darkMode ? 2 : 3);
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
    const points = [];
    let i = 0;
    for(; i < 250; i++) {
        const x = xA.getValue(i / 10) + xB.getValue(i / 10);
        const y = yA.getValue(i / 10) + yB.getValue(i / 10);
        points.push(new Node(new Point(width / 2 + x, height / 2 + y)));
    }

    return points;
}

function sinWave(t, speed, scale = 1) {
    return Math.abs(Math.sin(t * speed)) * scale;
}
