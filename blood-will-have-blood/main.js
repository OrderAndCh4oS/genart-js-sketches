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
    radius = 1,
    graph,
    centre,
    ellipseRadiusA,
    ellipseRadiusB,
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 24,
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
    if(e.code === 'Space') {
        play = !play;
    } else {
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
    context.clearRect(0, 0, width, height);
    ellipseRadiusA = width / 2 * 0.9;
    ellipseRadiusB = height / 2 * 0.1;
    centre = new Point(width / 2, ellipseRadiusB);
    graph = new Graph();
    for(let a = 0; a < TAU; a += TAU / count) {
        const point = Ellipse.getEllipsePoint(centre.x, centre.y, ellipseRadiusA, ellipseRadiusB, a);
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
    context.strokeStyle = 'rgba(22,19,12, 0.15)';
    context.lineJoin = 'bevel';
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(graph.points[0].x, graph.points[0].y);
    let root = graph.root;
    while(root.next) {
        const point = root.point;
        context.lineTo(point.x, point.y);
        root = root.next.b;
    }
    context.lineTo(graph.points[0].x, graph.points[0].y);
    context.stroke();

    root = graph.root;
    while(root.next) {
        const point = root.point;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, TAU, true);
        context.fill();
        root = root.next.b;
    }
}

function update() {
    // context.clearRect(0, 0, width, height);
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
