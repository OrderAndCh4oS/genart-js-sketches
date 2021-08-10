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
    radius = 3.33,
    graph,
    centre,
    circleRadius,
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 12,
    play = true,
    darkMode = false
;

window.onclick = function() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    initialise();
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
    const minDimension = width <= height ? width : height;
    circleRadius = minDimension / 2 * 0.666;
    graph = new Graph();
    for(let a = 0; a <= TAU; a += TAU / 240) {
        const point = Ellipse.getCirclePoint(centre.x, centre.y, circleRadius, a);
        graph.addNode(point);
    }
    graph.makeEdges();
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function drawPoints() {
    context.fillStyle = darkMode ? '#E8E5D7' : '#FF4100';
    context.strokeStyle = '#16130C';
    context.lineWidth = 2.5;

    context.beginPath();
    context.moveTo(graph.points[0].x, graph.points[0].y);
    for(const point of graph.points) {
        context.lineTo(point.x, point.y);
    }
    context.lineTo(graph.points[0].x, graph.points[0].y)
    context.stroke();

    for(const point of graph.points) {
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, TAU, true);
        context.fill();
    }
}

function update() {
    context.clearRect(0, 0, width, height);
    drawPoints();
    graph.update()
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
