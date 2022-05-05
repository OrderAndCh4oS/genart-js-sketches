const PI = Math.PI;
const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    lineLayer = document.createElement('canvas'),
    dotLayer = document.createElement('canvas'),
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 12,
    play = true,
    iteration = 0,
    throttled = false,
    timeout = null,
    centre,
    width,
    height,
    diagonalLength,
    length,
    context = canvas.getContext('2d'),
    lineLayerContext = lineLayer.getContext('2d'),
    dotLayerContext = dotLayer.getContext('2d'),
    nodes,
    nodeQueues,
    strokeColours,
    strokeWeight,
    dotColours,
    lines,
    dots
;

width = canvas.width = lineLayer.width = dotLayer.width = window.innerWidth;
height = canvas.height = lineLayer.height = dotLayer.height = window.innerHeight;
const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.8, Ease.EASE_OUT);
const colourSet = colours[colourIndex];
const ModeTypes = Object.freeze({
    light: 'Light',
    dark: 'Dark',
    blackAndWhite: 'Black & White',
    blackAndWhitePure: 'Black & White Pure'
});
const mode = fxrand();
let background;
let selectedColours = shuffle(colourSet.colours);
let selectedDotColours;
let modeType;
switch(true) {
    case mode > 0.45 && mode <= 0.8:
        modeType = ModeTypes.dark;
        background = colourSet.black;
        selectedDotColours = [colourSet.black];
        break;
    case mode > 0.8 && mode <= 0.92:
        modeType = ModeTypes.blackAndWhite;
        selectedColours = [colourSet.black, colourSet.white];
        selectedDotColours = [colourSet.white, colourSet.black];
        background = colourSet.colours[~~(fxrand() * colourSet.colours.length)];
        break;
    case mode > 0.92 && mode <= 0.96:
        modeType = ModeTypes.blackAndWhitePure;
        selectedColours = [colourSet.black];
        selectedDotColours = [colourSet.white];
        background = colourSet.white;
        break;
    case mode > 0.96:
        modeType = ModeTypes.blackAndWhitePure;
        selectedColours = [colourSet.white];
        selectedDotColours = [colourSet.black];
        background = colourSet.black;
        break;
    default:
        modeType = ModeTypes.light;
        background = colourSet.white;
        selectedDotColours = [colourSet.white];
}

const nodeTypesRoll = fxrand();
let nodeTypes;
switch(true) {
    case nodeTypesRoll > 0.85:
        nodeTypes = 3;
        break;
    case nodeTypesRoll > 0.55:
        nodeTypes = 2;
        break;
    default:
        nodeTypes = 1;
}

document.body.style.backgroundColor = background;

if(colourSet.name === 'Constructivist' && modeType === ModeTypes.dark) {
    selectedColours.push(colourSet.white);
    selectedDotColours.push(colourSet.black);
}

if(colourSet.name === 'Constructivist' && modeType === ModeTypes.light) {
    selectedColours.push(colourSet.black);
}

window.$fxhashFeatures = {
    'Colour': colourSet.name,
    'Mode': modeType,
    'Node Types': nodeTypes
};

window.onclick = function(event) {
    initialise();
    update();
};

window.onkeyup = function(e) {
    if(e.code === 'Space') {
        play = !play;
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
    width = canvas.width = lineLayer.width = dotLayer.width = window.innerWidth;
    height = canvas.height = lineLayer.height = dotLayer.height = window.innerHeight;
    diagonalLength = Math.sqrt(width * width + height * height);
    length = diagonalLength * 0.012;
    strokeWeight = diagonalLength * 0.0019;
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    dotLayerContext.clearRect(0, 0, width, height);
    lineLayerContext.clearRect(0, 0, width, height);
    nodes = [];
    nodeQueues = [];
    strokeColours = [];
    dotColours = [];
    for(let x = -8; x < width + 8; x += length) {
        for(let y = -8; y < height + 8; y += (fxrand() * 4) + length) {
            nodes.push(new Node(x + (fxrand() * 4), y));
        }
    }
    const centre = new Node(width / 2, height / 2);
    const kdTree = new KdTree(nodes);
    const startNodes = kdTree.findKnn(6, centre);
    for(let i = 0; i < startNodes.length; i++) {
        strokeColours.push(selectedColours[i % selectedColours.length]);
        dotColours.push(selectedDotColours[i % selectedColours.length]);
        nodeQueues.push([startNodes[i]]);
    }
    lines = [];
    dots = [];
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    lines = [];
    for(let i = 0; i < nodeQueues.length; i++) {
        const nodeQueue = nodeQueues[i];
        if(!nodeQueue.length) return;
        const kdTree = new KdTree(nodes);
        const node = nodeQueue.pop();
        const foundNodes = kdTree.findKnnInRadius(3, length * 2.5, node);
        for(const n of foundNodes) {
            nodeQueue.push(n);
            lines.push([node, n, strokeColours[i], dotColours[i]]);
        }
        for(let i = nodes.length - 1; i >= 0; i--) {
            for(let j = foundNodes.length - 1; j >= 0; j--) {
                if(nodes[i].equals(foundNodes[j])) {
                    nodes.splice(i, 1);
                    break;
                }
            }
        }
    }
    lineLayerContext.lineWidth = strokeWeight;
    dotLayerContext.lineWidth = strokeWeight;
    for(const line of lines) {
        lineLayerContext.strokeStyle = line[2];
        lineLayerContext.beginPath();
        lineLayerContext.moveTo(line[0].x, line[0].y);
        lineLayerContext.lineTo(line[1].x, line[1].y);
        lineLayerContext.stroke();
        const x = line[1].x;
        const y = line[1].y;
        switch(~~(fxrand() * nodeTypes)) {
            case 0:
                dotLayerContext.beginPath();
                dotLayerContext.arc(x, y, length * 0.2, 0, TAU, true);
                break;
            case 1:
                const size = length * 0.4;
                dotLayerContext.beginPath();
                dotLayerContext.rect(x - size / 2, y - size / 2, size, size);
                break;
            case 2:
                const radius = length * 0.3;
                const x1 = radius * Math.cos((TAU * 0.75)) + x;
                const y1 = radius * Math.sin((TAU * 0.75)) + y;
                const x2 = radius * Math.cos((0.33333) * TAU + (TAU * 0.75)) + x;
                const y2 = radius * Math.sin((0.33333) * TAU + (TAU * 0.75)) + y;
                const x3 = radius * Math.cos((0.66666) * TAU + (TAU * 0.75)) + x;
                const y3 = radius * Math.sin((0.66666) * TAU + (TAU * 0.75)) + y;
                dotLayerContext.beginPath();
                dotLayerContext.moveTo(x1, y1);
                dotLayerContext.lineTo(x2, y2);
                dotLayerContext.lineTo(x3, y3);
                dotLayerContext.closePath();
                break;
        }
        dotLayerContext.strokeStyle = line[2];
        dotLayerContext.fillStyle = line[3];

        dotLayerContext.fill();
        dotLayerContext.stroke();
    }
    context.fillStyle = background;
    console.log('context.fillStyle = background;',
        context.fillStyle = background);
    context.fillRect(0, 0, width, height);
    context.drawImage(lineLayer, 0, 0);
    context.drawImage(dotLayer, 0, 0);
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

function shuffle(arr) {
    let randomizedArray = [];
    let array = [...arr];
    while(array.length !== 0) {
        let rIndex = Math.floor(array.length * fxrand());
        randomizedArray.push(array[rIndex]);
        array.splice(rIndex, 1);
    }
    return randomizedArray;
}
