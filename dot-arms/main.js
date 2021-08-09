const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    darkBackground = '#FF4100',
    lightBackground = '#E8E5D7',
    count = 100,
    radius = 6,
    points,
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 12,
    play = false,
    darkMode = true
;

window.onclick = function() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    update();
};

window.onkeyup = function(e) {
    if(e.code === 'Space') play = !play;
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
    update();
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
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function drawPoints(fillColour, strokeColour) {
    points = Array(count)
        .fill(0)
        .map(() => new Node(Math.random() * width, Math.random() * height));
    context.fillStyle = fillColour;
    context.strokeStyle = strokeColour;
    context.lineWidth = 10;
    const kdTree = new KdTree(points);

    for(const point of points) {
        const root = kdTree.tree;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(root.x, root.y);
        context.stroke();
    }

    for(const point of points) {
        context.beginPath();
        context.arc(point.x, point.y, 6, 0, TAU, true);
        context.fill();
    }
}

function update() {
    context.clearRect(0, 0, width, height);
    drawPoints(darkMode ? '#E8E5D7' : '#FF4100', darkMode ? '#16130C' : '#16130C');
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
