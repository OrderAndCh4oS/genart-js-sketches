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
    iteration = 0,
    play = true,
    darkMode = true,
    darkBackground = '#FF4100',
    lightBackground = '#E8E5D7',
    colours = ['#16130c', '#E8E5D7'],
    currentColour,
    graph,
    kdTree,
    vectors = []
;

window.onclick = function() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    colours = darkMode ? ['#16130c', '#E8E5D7'] : ['#FF4100', '#E8E5D7'];
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
    context.clearRect(0, 0, width, height);
    graph = new Graph();
    vectors = [];
    vectors.push(new Vector(centre.x, centre.y));
    vectors.push(new Vector(centre.x + 100, centre.y + 100));
    vectors.push(new Vector(centre.x + 200, centre.y + 100));
    vectors.push(new Vector(centre.x + 150, centre.y + 150));
    vectors.push(new Vector(centre.x - 100, centre.y - 100));
    vectors.push(new Vector(centre.x - 200, centre.y - 100));
    vectors.push(new Vector(centre.x - 150, centre.y - 150));
    vectors.push(new Vector(centre.x + 100, centre.y - 100));
    vectors.push(new Vector(centre.x + 200, centre.y - 100));
    vectors.push(new Vector(centre.x + 150, centre.y - 150));
    vectors.push(new Vector(centre.x - 100, centre.y + 100));
    vectors.push(new Vector(centre.x - 200, centre.y + 100));
    vectors.push(new Vector(centre.x - 150, centre.y + 150));
    for(const vector of vectors) {
        graph.addNode(vector);
    }
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function drawPoints() {
    context.fillStyle = darkMode ? '#E8E5D7' : '#FF4100';
    context.strokeStyle = colours[iteration % colours.length];
    context.lineJoin = 'bevel';
    context.lineWidth = 1;

    kdTree = new KdTree(graph.nodes);
    const nearest = kdTree._findInRadius(210, graph.nodes[0]);

    for(let i = 0; i < nearest.length; i++) {
        let vector = nearest[i].point;
        console.log(vector, graph.nodes[0].point);
        vector.pullTo(graph.nodes[0].point, 0.01);
    }
    for(let i = 0; i < vectors.length; i++) {
        let vector = vectors[i];
        context.beginPath();
        context.arc(vector.x, vector.y, 5, 0, TAU, true);
        context.fill();
    }
}

function update() {
    drawPoints();
}

function render() {
    requestAnimationFrame(render);
    now = Date.now();
    elapsed = now - then;
    if(elapsed <= fpsInterval) return;
    then = now - (elapsed % fpsInterval);
    if(!play) return;
    iteration++;
    update();
}
