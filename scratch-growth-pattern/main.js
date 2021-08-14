const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    darkBackground = '#FF4100',
    lightBackground = '#E8E5D7',
    count = 256,
    circleRadius = 60,
    radius = 2,
    lineWidth = 1.25,
    graph,
    centre,
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 24,
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
    centre = new Point(-(circleRadius + 10), height / 2);
    context.clearRect(0, 0, width, height);
    graph = new Graph();
    for(let i = 0; i < count; i++) {
        const a = i * (TAU / count);
        const point = Ellipse.getEllipsePoint(centre.x, centre.y, circleRadius, height, a);
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
    context.strokeStyle = 'rgba(22,19,12, 0.1)';
    context.lineJoin = 'bevel';
    context.lineWidth = lineWidth;

    context.beginPath();
    context.moveTo(graph.points[0].x, graph.points[0].y);
    const start = graph.root;

    let root = graph.root;
    do {
        const point = root.point;
        context.lineTo(point.x, point.y);
        root = root.next?.b;
    } while(root !== start)
    context.lineTo(graph.points[0].x, graph.points[0].y);
    context.stroke();

    root = graph.root;
    do {
        const point = root.point;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, TAU, true);
        context.fill();
        root = root.next?.b;
    } while(root !== start)
}

function update() {
    drawPoints();
    graph.update();
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
