const TAU = Math.PI * 2;
const PI = Math.PI;

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
    play = true,
    darkMode = true,
    red = '#FF4100',
    black = '#16130c',
    white = '#E8E5D7',
    darkBackground = black,
    lightBackground = red,
    iteration = 0,
    lines = [],
    endLines = [],
    coneAngle = PI * 0.66,
    count = 15,
    lineWidth
;

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    initialise();
    update();
}

window.onclick = function() {
    toggleDarkMode();
};

window.onkeyup = function(e) {
    if(e.code === 'Space') {
        play = !play;
    } else {
        // toggleDarkMode();
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
    centre = new Point(width / 2, height / 2);
    iteration = 0;
    currentColour = 0;
    count = 3;
    const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
    const length = diagonal * 0.038;
    const startLineWidth = diagonal * 0.0075;
    context.clearRect(0, 0, width, height);
    const startLine = new Line(
        new Point(width / 2, height / 4),
        new Point(width / 2, height / 4 + length),
    );
    startLine.width = startLineWidth;
    lines = [startLine];
    endLines = [startLine];
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    const branchFrom = [...endLines];
    const newLines = [];
    const toRemove = [];
    for(let i = 0; i < count; i++) {
        let index = ~~(Math.random() * branchFrom.length);
        let branch = branchFrom[index];
        for(let j = 0; j < 4; j++) {
            const v1 = new Vector(branch.a.x, branch.a.y);
            const v2 = new Vector(branch.b.x, branch.b.y);
            const v3 = new Vector(branch.b.x, branch.b.y);
            const angleFrom = v1.angleTo(v2);
            const angleMod = Math.random() * coneAngle - (coneAngle / 2);

            const v4 = new Vector(0, 0);
            v4.length = (branch.length * 0.98);
            v4.angle = angleFrom + angleMod;
            v2.addTo(v4);

            const v5 = new Vector(0, 0);
            v5.length = branch.length + 15;
            v5.angle = angleFrom + angleMod;
            v3.addTo(v5);

            const intersectLine = new Line(branch.b, new Point(v3.x, v3.y));

            const line = new Line(branch.b, new Point(v2.x, v2.y));
            line.width = branch.width * 0.95;

            let isIntersect = false;
            for(const otherLine of lines) {
                if(otherLine === intersectLine) continue;
                if(intersectLine.isIntersect(otherLine)) {
                    isIntersect = true;
                    break;
                }
            }
            for(const otherLine of newLines) {
                if(otherLine === intersectLine) continue;
                if(intersectLine.isIntersect(otherLine)) {
                    isIntersect = true;
                    break;
                }
            }
            if(!isIntersect) {
                if(isInBounds(line.b, width - 20, height - 20)) {
                    newLines.push(line);
                }
                toRemove.push(index);
            }
        }
    }

    for(const index of [...new Set(toRemove.sort((a, b) => b - a))]) {
        branchFrom.splice(index, 1);
    }

    endLines = [...branchFrom, ...newLines];
    lines.push(...newLines);

    context.clearRect(0, 0, width, height);
    context.strokeStyle = darkMode ? white : black;
    context.fillStyle = darkMode ? red : white;

    for(const line of lines) {
        context.lineWidth = line.width;
        context.beginPath();
        context.moveTo(line.a.x, line.a.y);
        context.lineTo(line.b.x, line.b.y);
        context.stroke();
        context.beginPath();
        context.moveTo(line.a.x, line.a.y);
        context.lineTo(line.b.x, line.b.y);
        context.stroke();
    }

    context.beginPath();
    context.arc(lines[0].a.x, lines[0].a.y, (lines[0].width / 2) + lines[0].width * 0.5, 0, TAU, true);
    context.fill();
    for(const line of lines) {
        context.beginPath();
        context.arc(line.b.x, line.b.y, (line.width / 2) + line.width * 0.5, 0, TAU, true);
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
