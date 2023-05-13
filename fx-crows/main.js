const TAU = Math.PI * 2;
const PI = Math.PI;

let canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    throttled = false,
    timeout = null,
    width,
    height,
    centre,
    play = true,
    black = '#16130c',
    white = '#E8E5D7',
    red = '#FF4100',
    lightBackground = white,
    lines = [],
    endLines = [],
    coneAngle = PI * 0.88,
    lineWidth
;

window.onclick = function () {
    initialise();
    draw();
};

window.onkeyup = function (e) {
    if (e.code === 'Space') {
        play = !play;
    }
};

window.onresize = function () {
    clearTimeout(timeout);
    timeout = setTimeout(resizeHandler, 100);
    if (throttled) return;
    resizeHandler();
    throttled = true;
    setTimeout(function () {
        throttled = false;
    }, 250);
};

window.onload = function () {
    initialise();
    draw();
};

window.onmousemove = function (event) {
    // do nothing
};

function resizeHandler() {
    initialise();
    draw();
}

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centre = new Point(width / 2, height / 2);
    iteration = 0;
    currentColour = 0;
    context.clearRect(0, 0, width, height);
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function drawShape(line, width = 2) {
    const angle = line.getAngle();
    const aX = line.b.x + Math.cos(angle + Math.PI * 0.5) * width;
    const aY = line.b.y + Math.sin(angle + Math.PI * 0.5) * width;
    const bX = line.b.x + Math.cos(angle + Math.PI * 1.5) * width;
    const bY = line.b.y + Math.sin(angle + Math.PI * 1.5) * width;
    context.beginPath();
    context.moveTo(line.a.x, line.a.y);
    context.lineTo(aX, aY);
    context.lineTo(bX, bY);
    context.lineTo(line.a.x, line.a.y);
    context.fill()
}

function drawCircle(point, radius) {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, TAU, true);
    context.fill();
}

function getLine(x, y, length, angle = Math.random() * TAU) {
    const v = new Vector(x, y);
    const v1 = new Vector(0, 0);
    v1.length = length;
    v1.angle = angle;
    v.addTo(v1);
    return new Line(
        new Point(x, y),
        new Point(v.x, v.y)
    );
}

function draw() {
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < 100; i++) {
        const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
        const length = diagonal * 0.032;
        const startLineWidth = diagonal * 0.0075;
        const x = Math.random() * (width - 50) + 25;
        const y = Math.random() * (height - 50) + 25;
        const line = getLine(x, y, length);
        const lineTwo = getLine(line.b.x, line.b.y, length * 0.75);
        const lineThree = getLine(line.b.x, line.b.y, length * 0.75);
        line.width = startLineWidth;

        context.strokeStyle = white;
        context.fillStyle = red;
        drawShape(line, 6);
        drawShape(lineTwo, 6);
        drawShape(lineThree, 6);
        context.translate(-3, -2)
        context.fillStyle = black;
        drawShape(line, 8);
        drawShape(lineTwo, 8);
        drawShape(lineThree, 8);
        drawCircle(line.b, 12);
        context.fillStyle = white;
        drawCircle(line.b, 8);
        context.fillStyle = red;
        drawCircle(line.b, 4);

    }
}

function isInBounds(p, w, h) {
    return !(p.x < 20 || p.y < 20 || p.x > w || p.y > h);
}
