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
    darkMode = true,
    darkBackground = '#16130c',
    lightBackground = '#FF4100',
    graphOne = null,
    graphTwo = null,
    kdTree,
    radiusScaleOne = 96,
    radiusScaleTwo = 24,
    countOne = 0.13,
    countTwo = 0.06,
    radius = 0.66
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

function makeGraph(radius, count) {
    const graph = new Graph();
    for(let a = 0; a < TAU; a += TAU / count) {
        const point = Ellipse.getCirclePoint(centre.x, centre.y, radius, a);
        graph.addNode(new Vector(point.x, point.y));
    }
    graph.makeEdges();
    return graph;
}

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centre = new Point(width / 2, height / 2);
    context.clearRect(0, 0, width, height);
    const minDimension = Math.min(width, height);
    graphOne = makeGraph(minDimension * 0.333, ~~(minDimension * countOne));
    graphTwo = makeGraph(minDimension * 0.125, ~~(minDimension * countTwo));
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function updateGraph(graph) {
    const kdTree = new KdTree(graph.nodes);
    let root = graph.root;
    const start = graph.root;
    do {
        const kNearest = kdTree.findKnnInRadius(8, 66, root);
        if(root.left) root.point.pullTo(root.left, 0.004);
        if(root.right) root.point.pullTo(root.right, 0.004);
        for(const node of kNearest) {
            node.point.pushFrom(root.point, 0.005);
        }
        root = root.next?.b;
        if(!root) break;
    } while(root !== start);
    if(graph.nodes.length < 500) {
        if(Math.random() < 0.5) {
            const edge = graph.edges[~~(Math.random() * graph.edges.length)];
            graph.splitEdge(edge);
        }

        for(const edge of graph.edges) {
            if(edge.a.distanceTo(edge.b) > 35) {
                graph.splitEdge(edge);
            }
        }
    }
}

function drawConnections(graph) {
    let root = graph.root;
    const start = graph.root;
    const region = new Path2D();
    region.moveTo(graph.points[0].x, graph.points[0].y);
    do {
        const point = root.point;
        region.lineTo(point.x, point.y);
        root = root.next?.b;
    } while(root !== start);
    region.closePath();
    context.stroke(region);
}

function drawDots(graph) {
    let root = graph.root;
    const start = graph.root;
    do {
        const point = root.point;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, TAU, true);
        context.fill();
        root = root.next?.b;
    } while(root !== start);
}

function draw(graph, fillColour, strokeColour) {
    context.fillStyle = fillColour;
    context.strokeStyle = strokeColour;
    context.lineJoin = 'bevel';
    context.lineWidth = 2;

    drawConnections(graph);
    drawDots(graph);
}

function update() {
    updateGraph(graphOne);
    draw(
        graphOne,
        darkMode ? '#E8E5D7' : '#E8E5D7',
        darkMode ? 'rgba(255,65,0, 0.1)' : 'rgba(22,19,12, 0.15)',
    );
    updateGraph(graphTwo);
    draw(
        graphTwo,
        darkMode ? '#FF4100' : '#16130c',
        darkMode ? 'rgba(232,229,215, 0.125)' : 'rgba(232,229,215, 0.125)',
    );
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
