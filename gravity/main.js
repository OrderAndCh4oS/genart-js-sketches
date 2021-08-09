const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    darkBackground = '#FF4100',
    lightBackground = '#E8E5D7',
    count = 50,
    radius = 12,
    particles,
    points,
    centre,
    circleRadius,
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 12,
    play = true,
    darkMode = true
;

window.onclick = function() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    initialise();
    update();
};

window.onkeyup = function(e) {
    if(e.code === 'Space') {
        darkMode = !darkMode;
        document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
        initialise();
        update();
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
    circleRadius = width / 2 * 0.8;
    particles = Array(count)
        .fill(0)
        .map(() => new Particle(
            (Math.random() * (width - radius * 2)) + radius,
            (Math.random() * (height - radius * 2)) + radius,
            5,
            Math.random() * TAU,
            0,
            1,
        ));
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function drawPoints(strokeColour) {
    context.fillStyle = darkMode ? '#E8E5D7' : '#FF4100';
    context.strokeStyle = strokeColour;

    context.beginPath();
    context.arc(centre.x, centre.y, circleRadius, 0, TAU, true);
    context.fill();

    context.lineWidth = radius * 2 - 8;
    const kdTree = new KdTree(points);

    for(const point of points) {
        const nearest = kdTree.findNearest(point);
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(nearest.x, nearest.y);
        context.stroke();
    }

    for(const point of points) {
        if(point.distanceTo(centre) < circleRadius) {
            context.fillStyle = !darkMode ? '#E8E5D7' : '#FF4100';
        } else {
            context.fillStyle = darkMode ? '#E8E5D7' : '#FF4100';
        }
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, TAU, true);
        context.fill();
    }
}

function update() {
    context.clearRect(0, 0, width, height);
    for(const particle of particles) {
        particle.update();
        particle.gravitateTo(new Particle(width / 2, height / 2, 0, 0, 1, 1, 2500));
        if(particle.position.x > width - radius || particle.position.x <
            radius) particle.velocity.x = -particle.velocity.x;
        if(particle.position.y > height - radius || particle.position.y <
            radius) particle.velocity.y = -particle.velocity.y;
    }
    points = particles.map(p => new Node(p.point));
    drawPoints(darkMode ? '#16130C' : '#16130C');
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
