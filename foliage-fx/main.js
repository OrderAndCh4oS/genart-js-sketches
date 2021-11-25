const TAU = Math.PI * 2;
const PI = Math.PI;

let canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    throttled = false,
    timeout = null,
    width,
    height,
    fpsInterval,
    now,
    elapsed,
    then,
    fps = 12,
    startTime,
    play = true,
    black = '#16130c',
    white = '#E8E5D7',
    lightBackground = white,
    iteration = 0,
    lines = [],
    endLines = [],
    lineWidth,
    complete = false,
    pause,
    redrawTimeout
;

const colours = [
    {
        black: '#1F1A38',
        white: '#F2F0FF',
        stems: ['#777C65', '#DBC87B'],
        foliage: ['#E36F84', '#BF1F5A', '#72052e']
    },
    {
        black: '#172526',
        white: '#D5D9D2',
        stems: ['#455759', '#748C8C'],
        foliage: ['#D93E30', '#e16007', '#d31066']
    }
];

const colourSet = colours[~~(colours.length * Math.random())];
const darkMode = Math.random() > 0.5;
const background = darkMode
    ? colourSet.black
    : colourSet.white;
document.body.style.backgroundColor = background;
const stems = colourSet.stems;
const foliage = colourSet.foliage;
const lean = 0.2 + Math.random() * 0.6;
const coneAngle = PI * 0.33 + Math.random() * 0.33;
const startLines = [];
const length = 65;
const startLineWidth = 12;

for(let i = 0; i <= 3; i++) {
    startLines.push(getStartLine(length, startLineWidth));
}

window.onclick = function() {
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
    const x = width / 2;
    const y = height / 2;
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

function initStartLines() {
    lines = [...startLines];
    endLines = [...startLines];
}

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    iteration = 0;
    currentColour = 0;
    initStartLines();
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    complete = false;
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function drawShape(line) {
    context.fillStyle = line.colour;
    const angle = line.getAngle();
    const width = line.width / 2;
    const aX = line.a.x + Math.cos(angle + Math.PI * 0.5) * width;
    const aY = line.a.y + Math.sin(angle + Math.PI * 0.5) * width;
    const bX = line.a.x + Math.cos(angle + Math.PI * 1.5) * width;
    const bY = line.a.y + Math.sin(angle + Math.PI * 1.5) * width;
    context.beginPath();
    context.moveTo(line.b.x, line.b.y);
    context.lineTo(aX, aY);
    context.lineTo(bX, bY);
    context.lineTo(line.b.x, line.b.y);
    context.fill();
}

function completed() {
    complete = true;
    clearTimeout(redrawTimeout);
    redrawTimeout = setTimeout(initStartLines, 2500);
}

function update() {
    context.strokeStyle = white;

    if(complete) return;
    console.log('HERE');
    for(const line of endLines) {
        drawShape(line);
    }

    if(!endLines.length) {
        completed();
        return;
    }
    const branchFrom = [...endLines];
    const newLines = [];

    for(let i = 0; i < branchFrom.length; i++) {
        let branch = branchFrom[i];
        for(let j = 0; j <= 3; j++) {
            const v1 = new Vector(branch.a.x, branch.a.y);
            const v2 = new Vector(branch.b.x, branch.b.y);
            const v3 = new Vector(branch.b.x, branch.b.y);
            const angleFrom = v1.angleTo(v2);
            const angleMod = Math.random() * coneAngle - (coneAngle * lean);

            const v4 = new Vector(0, 0);
            const branchLength = (branch.length * 0.94);
            if(branchLength < 30) {
                completed();
                return;
            }
            v4.length = branchLength;
            v4.angle = angleFrom + angleMod;
            v2.addTo(v4);

            const v5 = new Vector(0, 0);
            v5.length = branch.length + 5;
            v5.angle = angleFrom + angleMod;
            v3.addTo(v5);

            const intersectLine = new Line(branch.b, new Point(v3.x, v3.y));

            const line = new Line(branch.b, new Point(v2.x, v2.y));
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
            if(!isIntersect && isInBounds(line.b, width - 20, height - 20)) {
                line.width = branch.width * 0.96;
                line.colour = line.length < 50
                    ? foliage[~~(Math.random() * foliage.length)]
                    : stems[~~(Math.random() * stems.length)];
                newLines.push(line);
            }
        }
    }

    endLines = [...newLines];
    lines.push(...newLines);
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
