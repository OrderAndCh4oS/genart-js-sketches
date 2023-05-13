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

window.onclick = function() {
    initialise();
    draw();
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
    draw();
};

window.onmousemove = function(event) {
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

function draw() {
    context.clearRect(0, 0, width, height);
    for(let i = 0; i < 10; i++) {
        const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
        const length = diagonal * 0.032;
        const startLineWidth = diagonal * 0.0075;
        const x = Math.random() * (width - 100) + 50;
        const y = Math.random() * (height - 100) + 50;
        const v = new Vector(x, y);
        const v1 = new Vector(0, 0);
        v1.length = length;
        v1.angle = Math.random() * TAU;
        v.addTo(v1);
        const startLine = new Line(
            new Point(x, y),
            new Point(v.x, v.y)
        );
        startLine.width = startLineWidth;
        lines = [startLine];
        endLines = [startLine];

        let branchLength = Infinity;
        while(branchLength > 34 && endLines.length) {
            const branchFrom = [...endLines];
            const newLines = [];

            for(let i = 0; i < branchFrom.length; i++) {
                let branch = branchFrom[i];
                for(let j = 0; j < 4; j++) {
                    const v1 = new Vector(branch.a.x, branch.a.y);
                    const v2 = new Vector(branch.b.x, branch.b.y);
                    const v3 = new Vector(branch.b.x, branch.b.y);
                    const angleFrom = v1.angleTo(v2);
                    const angleMod = Math.random() * coneAngle - (coneAngle * 0.5);

                    const v4 = new Vector(0, 0);
                    branchLength = (branch.length * 0.95)
                    v4.length = branchLength;
                    v4.angle = angleFrom + angleMod;
                    v2.addTo(v4);

                    const v5 = new Vector(0, 0);
                    v5.length = branch.length + 5;
                    v5.angle = angleFrom + angleMod;
                    v3.addTo(v5);

                    const intersectLine = new Line(branch.b, new Point(v3.x, v3.y));

                    const line = new Line(branch.b, new Point(v2.x, v2.y));
                    line.width = branch.width * 0.91;

                    let isIntersect = false;
                    for(const otherLine of lines) {
                        if(otherLine === intersectLine) continue;
                        if(intersectLine.isIntersect(otherLine)) {
                            isIntersect = true;
                        }
                    }
                    for(const otherLine of newLines) {
                        if(otherLine === intersectLine) continue;
                        if(intersectLine.isIntersect(otherLine)) {
                            isIntersect = true;
                        }
                    }
                    if(!isIntersect) {
                        if(isInBounds(line.b, width - 20, height - 20)) {
                            newLines.push(line);
                        }
                    }
                }
            }
            endLines = [...newLines];
            lines.push(...newLines);
        }

        context.strokeStyle = white;
        context.fillStyle = red;
        for(const line of lines) {
            drawShape(line, 6);
        }

        context.translate(-3, -2)
        context.globalAlpha = 1;
        context.fillStyle = black;
        for(const line of lines) {
            drawShape(line, 8);
        }

        for(const line of lines) {
            if(line.length < 45) {
                context.fillStyle = black;
                drawCircle(line.b, ((45 - line.length) / 40) * 45);
                context.fillStyle = white;
                drawCircle(line.b, ((45 - line.length) / 40) * 25);
                context.fillStyle = red;
                drawCircle(line.b, ((45 - line.length) / 40) * 15);

            }
        }
    }
}

function isInBounds(p, w, h) {
    return !(p.x < 20 || p.y < 20 || p.x > w || p.y > h);
}
