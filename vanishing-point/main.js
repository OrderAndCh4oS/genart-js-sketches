const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    play = true,
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 12,
    darkBackground = '#16130C',
    lightBackground = '#E8E5D7',
    darkMode = false,
    count = 666,
    scale = 1,
    radius = 100,
    ratio = 1,
    values = [0.99, 1],
    moved = false
;

window.onmouseup = function() {
    toggleDarkMode();
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
    const center = new Point(width / 2, height / 2);
    scale = (center.distanceTo(event.clientX, event.clientY) / width / 2) + 0.00001;
};

window.ontouchstart = function() {
    moved = false;
};

window.ontouchmove = function(event) {
    moved = true;
    for(let i = 0; i < event.changedTouches.length; i++) {
        const x = event.changedTouches[i].pageX;
        const y = event.changedTouches[i].pageY;
        const center = new Point(width / 2, height / 2);
        scale = (center.distanceTo(x, y) / width / 2) + 0.0005;
    }
};

window.ontouchend = function() {
    if(!moved) toggleDarkMode();
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

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    update();
}

function drawShapes(scale, fillColours, strokeColour) {
    context.fillStyle = darkMode ? '#E8E5D7' : '#16130C';
    drawBenDayDots(0, 0, width, height, 12, 0.3, context);
    for(let i = 80; i > 0; i -= 2) {
        context.strokeStyle = '#fff';
        const start = Ellipse.getEllipsePoint(
            width / 2,
            height / 2,
            (radius * (i * scale)) * values[i],
            ((radius * ratio * i) * scale) * values[i],
            0,
        );
        context.beginPath();
        context.moveTo(start.x(), start.y());
        for(let j = 1; j <= count; j++) {
            const t = TAU / count * j;
            const point = Ellipse.getEllipsePoint(
                width / 2,
                height / 2,
                (radius * (i * scale)) * values[j % 2],
                (radius * ratio * (i * scale)) * values[j % 2],
                t,
            );
            context.lineTo(point.x(), point.y());
        }
        context.closePath();
        context.fillStyle = fillColours[(i / 2) % 2];
        context.strokeStyle = strokeColour;
        context.strokeWidth = 0;
        context.fill();
        context.stroke();
    }
}

function update() {
    context.clearRect(0, 0, width, height);
    drawShapes(scale, darkMode ? ['#E8E5D7', '#FF4100'] : ['#FF4100', '#16130C'],
        darkMode ? '#16130C' : '#E8E5D7');
    // drawPoints(scale * 0.5, darkMode ? '#FF4100' : '#E8E5D7', '#16130C');
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
