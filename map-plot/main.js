const TAU = Math.PI * 2;
const PI = Math.PI;

let canvas = document.getElementById('canvas'),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    throttled = false,
    timeout = null,
    fpsInterval,
    now,
    elapsed,
    then,
    fps = 24,
    startTime,
    play = true,
    black = '#16130c',
    white = '#E8E5D7',
    plot = []
;

window.onclick = function(event) {
    startX = event.clientX
    startY = event.clientY
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

function getStartLine(length, startLineWidth) {
    const x = startX;
    const y = startY;
    const angle = Math.random() * TAU;
    const aX = x + Math.cos(angle) * length;
    const aY = y + Math.sin(angle) * length;
    const startLine = new Line(
        new Point(x, y),
        new Point(aX, aY)
    );
    startLine.width = startLineWidth;
    startLine.colour = stems[~~(Math.random() * stems.length)];
    return startLine;
}

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    iteration = 0;
    plot = []
    for(let i = 0; i < width; i++) {
        plot.push(~~map(Math.random(), 0, 1, 0, 1000, 0.75, Ease.EASE_OUT));
    }
    plot = plot.sort((a, b) => a - b);
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    context.strokeStyle = black;

    console.log(plot);
    for(let i = 0; i < plot.length; i++){
        const y = plot[i];
        context.beginPath();
        context.arc(i, height - y, 1, 0, TAU, true);
        context.fill();
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

function isInBounds(p, w, h) {
    return !(p.x < 20 || p.y < 20 || p.x > w || p.y > h);
}
