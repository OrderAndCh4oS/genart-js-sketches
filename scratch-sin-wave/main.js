const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 30,
    play = true,
    iteration = 0,
    darkMode = false,
    throttled = false,
    timeout = null,
    centre,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    lightBackground = '#FF4100',
    darkBackground = '#16130c',
    count = 64,
    circleRadius = 60,
    radius = 6,
    lineWidth = 80,
    colours = ['#E8E5D7', '#16130c'],
    x,
    y,
    a = 0,
    b = 0
;

function toggleDarkMode() {
    darkMode = !darkMode;
    if(darkMode) {
        document.body.style.backgroundColor = darkBackground;
        colours = ['#FF4100', '#16130c', '#E8E5D7'];
        lineWidth = 30;
    } else {
        document.body.style.backgroundColor = lightBackground;
        colours = ['#E8E5D7', '#16130c'];
        lineWidth = 80;
    }
}

window.onclick = function() {
    toggleDarkMode();
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
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    context.clearRect(0, 0, width, height);
    iteration++;
    x = -(circleRadius + 50);
    y = height / 2;
    a = Math.PI += iteration * Math.PI / 24;
    b = Math.PI += iteration * Math.PI / 24;
    context.lineJoin = 'bevel';
    context.lineWidth = lineWidth;
    let i = 0;
    const dX = ((Math.abs(Math.sin(b)) / TAU) * 25);
    for(; x < width + circleRadius + 50; x += 30 + dX) {
        a += Math.PI / 12;
        const dY = ((Math.abs(Math.sin(a)) / TAU) * (height / 2.5));
        context.fillStyle = colours[(i + 1) % colours.length];
        context.strokeStyle = colours[i % colours.length];
        const points = [];
        for(let j = 0; j < count; j++) {
            const a = j * (TAU / count);
            const point = Ellipse.getEllipsePoint(x, y + dY, circleRadius, height * 0.28, a);
            points.push(point);
        }
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for(const point of points) {
            context.lineTo(point.x, point.y);
        }
        context.lineTo(points[0].x, points[0].y);
        context.stroke();

        if(darkMode) {
            for(const point of points) {
                context.beginPath();
                context.arc(point.x, point.y, radius, 0, TAU, true);
                context.fill();
            }
        }

        i++;
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
