const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    throttled = false,
    timeout = null,
    width,
    height,
    centre,
    diagonalLength,
    fpsInterval,
    now,
    elapsed,
    then,
    fps = 30,
    startTime,
    play = true,
    graphs,
    kdTree
;

width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 1, Ease.EASE_OUT);
const ringCount = ~~map(fxrand(), 0, 1, 35, 45, 0.75, Ease.EASE_OUT);
const spacingRoll = ~~(fxrand() * 3);
const colourSet = colours[colourIndex];
const selectedColours = colourSet.colours;
const mode = fxrand();
const darkMode = mode > 0.5;
const background = darkMode ? colourSet.black : colourSet.white;
const typeRoll = fxrand();
let type;
let blendMode;

switch(true) {
    case typeRoll < 0.33:
        type = 'writhe';
        blendMode = darkMode
            ? 'screen'
            : 'multiply';
        break;
    case typeRoll < 0.66:
        type = 'fracture';
        blendMode = 'source-over';
        break;
    default:
        type = 'tangle';
        blendMode = fxrand() > 0.66
            ? darkMode
                ? 'screen'
                : 'multiply'
            : 'source-over';
        break;
}

if(colourSet.name === 'Constructivist' && darkMode) {
    selectedColours.push(colourSet.white);
}

if(colourSet.name === 'Constructivist' && !darkMode) {
    selectedColours.push(colourSet.black);
}

window.$fxhashFeatures = {
    'Colour': colourSet.name,
    'Mode': darkMode ? 'Dark' : 'Light',
    'Blend Mode': blendMode === 'source-over'
        ? 'Normal'
        : blendMode[0].toUpperCase() + blendMode.slice(1),
    'Type': type[0].toUpperCase() + type.slice(1),
    'Rings': ringCount,
    'Spacing': ['Tight', 'Regular', 'Loose'][spacingRoll]
};

window.onclick = function() {
    initialise();
    update();
};

window.onkeyup = function(e) {
    if(e.code === 'Space') play = !play;
    if(e.code === 'KeyM') {
        blendMode = blendMode === 'source-over'
            ? darkMode
                ? 'screen'
                : 'multiply'
            : 'source-over';
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
    diagonalLength = Math.sqrt(width * width + height * height);
    const minDimension = Math.min(width, height);
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    graphs = [];
    for(let i = 5; i < ringCount + 5; i++) {
        const radius = [0.006, 0.008, 0.010][spacingRoll];
        graphs.push(makeGraph(minDimension * (radius * i),
            ~~(diagonalLength * (0.0007 * i))));
    }
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
        const kNearest = kdTree.findKnnInRadius(6, 100, root);
        if(root.left) root.point.pullTo(root.left, 0.008);
        if(root.right) root.point.pullTo(root.right, 0.008);
        for(const node of kNearest) {
            node.point.pushFrom(root.point, 0.005);
        }
        root = root.next?.b;
        if(!root) break;
    } while(root !== start);
    if(graph.nodes.length < 100) {
        if(fxrand() < 0.33) {
            const edge = graph.edges[~~(fxrand() * graph.edges.length)];
            graph.splitEdge(edge);
        }

        for(const edge of graph.edges) {
            if(edge.a.distanceTo(edge.b) > 150) {
                graph.splitEdge(edge);
            }
        }
    }
}

function drawConnections(graph) {
    context.globalCompositeOperation = blendMode;
    if(type === 'writhe') context.globalAlpha = 0.1;
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
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1;
    let root = graph.root;
    const start = graph.root;
    do {
        const point = root.point;
        context.beginPath();
        context.arc(point.x, point.y, 1.5, 0, TAU, true);
        context.fill();
        root = root.next?.b;
    } while(root !== start);
}

function draw(graph, fillColour, strokeColour) {
    context.fillStyle = fillColour;
    context.strokeStyle = strokeColour;
    context.lineJoin = 'bevel';
    switch(type) {
        case 'writhe':
            context.lineWidth = 0.5;
            break;
        case 'fracture':
            context.lineWidth = 2;
            break;
        case 'tangle':
            context.lineWidth = 4;
            break;
    }

    drawConnections(graph);
    drawDots(graph);
}

function update() {
    if(type === 'tangle') {
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
    }
    for(let i = 0; i < graphs.length; i++) {
        const graph = graphs[i];
        updateGraph(graph);
        draw(
            graph,
            selectedColours[i % selectedColours.length],
            selectedColours[(i + 1) % selectedColours.length]
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
}
