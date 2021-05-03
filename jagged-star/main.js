const TAU = Math.PI * 2;
let canvas = document.getElementById('canvas'),
    throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    darkBackground = '#16130C',
    lightBackground = '#E8E5D7',
    count = 20,
    radius = 50,
    scale = 0.25,
    ratio = 1.5,
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
    scale = (event.clientY / height) * 0.2 + 0.05;
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

function drawShapes(scale, fillColour, strokeColour) {
    const values = Array(count).fill(0).map(() => Math.random());
    for(let i = 100; i > 0; i--) {
        context.strokeStyle = '#fff';
        const start = Ellipse.getEllipsePoint(
            width / 2,
            height / 2,
            (radius * (i * scale)) * values[0],
            ((radius * ratio * i) * scale) * values[0],
            0,
        );
        context.beginPath();
        context.moveTo(start.x(), start.y());
        for(let j = 1; j < count; j++) {
            const t = TAU / count * j;
            const point = Ellipse.getEllipsePoint(
                width / 2,
                height / 2,
                (radius * (i * scale)) * values[j],
                (radius * ratio * (i * scale)) * values[j],
                t,
            );
            context.lineTo(point.x(), point.y());
        }
        context.closePath();
        context.fillStyle = fillColour;
        context.strokeStyle = strokeColour;
        context.strokeWidth = 0.5;
        context.fill();
        context.stroke();
    }
}

function update() {
    context.clearRect(0, 0, width, height);
    drawShapes(scale, darkMode ? '#E8E5D7' : '#FF4100', '#16130C');
    drawShapes(scale * 0.5, darkMode ? '#FF4100' : '#E8E5D7', '#16130C');
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
