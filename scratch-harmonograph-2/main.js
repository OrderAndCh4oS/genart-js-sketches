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
    radius,
    count,
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
    amplitudeYBStep,
    frequencyXAStep,
    frequencyYAStep,
    frequencyXBStep,
    frequencyYBStep
;

function toggleDarkMode() {
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

function resizeHandler() {
    initialise();
    update();
}

function initialise() {
    iteration = 0;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centre = new Point(width / 2, height / 2);
    radius = 3;
    count = ~~(Math.random() * 10 + 5);
    frequencyXA = Math.random() * 0.9 + 0.05;
    frequencyXB = Math.random() * 0.9 + 0.05;
    frequencyYA = Math.random() * 0.9 + 0.05;
    frequencyYB = Math.random() * 0.9 + 0.05;
    phaseXA = (Math.random() * 175) + 25;
    phaseXB = (Math.random() * 175) + 25;
    phaseYA = (Math.random() * 175) + 25;
    phaseYB = (Math.random() * 175) + 25;
    amplitudeXA = (Math.random() * 175) + 25;
    amplitudeXB = (Math.random() * 175) + 25;
    amplitudeYA = (Math.random() * 175) + 25;
    amplitudeYB = (Math.random() * 175) + 25;
    dampingXA = (Math.random() * 0.0095) + 0.0005;
    dampingXB = (Math.random() * 0.0095) + 0.0005;
    dampingYA = (Math.random() * 0.0095) + 0.0005;
    dampingYB = (Math.random() * 0.0095) + 0.0005;

    while(Math.abs(frequencyXA - frequencyXB) < 0.2) {
        frequencyXB = Math.random();
    }

    while(Math.abs(frequencyYA - frequencyYB) < 0.2) {
        frequencyYB = Math.random();
    }

    context.translate(centre.x, centre.y);

}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    context.clearRect(-width / 2, -height / 2, width, height);
    for(let i = 0; i < 1; i++) {
        context.fillStyle = colours[i % colours.length];
        squiggle(
            frequencyXA, phaseXA, amplitudeXA, dampingXA,
            frequencyXB, phaseXB, amplitudeXB, dampingXB,
            frequencyYA, phaseYA, amplitudeYA, dampingYA,
            frequencyYB, phaseYB, amplitudeYB, dampingYB
        );
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
    frequencyYB, phaseYB, amplitudeYB, dampingYB
) {
    const xA = new Harmonograph(frequencyXA, phaseXA, amplitudeXA, dampingXA);
    const xB = new Harmonograph(frequencyXB, phaseXB, amplitudeXB, dampingXB);
    const yA = new Harmonograph(frequencyYA, phaseYA, amplitudeYA, dampingYA);
    const yB = new Harmonograph(frequencyYB, phaseYB, amplitudeYB, dampingYB);
    let scale = 1;
    const points = [];
    let i = iteration * 3;
    const steps = i + 350;
    for(; i < steps; i++) {
        const x = xA.getValue(i / 25) + xB.getValue(i / 25);
        const y = yA.getValue(i / 25) + yB.getValue(i / 25);
        points.push(new Point(x, y));
    }

    for(let j = 1; j < points.length; j++) {
        let p = points[j];
        for(let r = 0; r < count; r++) {

            context.beginPath();
            context.arc(p.x, p.y, radius, 0, TAU, true);
            context.fill();
            // context.stroke();
            scale *= 0.9999;
            context.rotate(TAU / count);
        }
    }
}

function sinWave(t, speed, scale = 1) {
    return Math.abs(Math.sin(t * speed)) * scale;
}
