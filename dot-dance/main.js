const TAU = Math.PI * 2;

let canvas = document.getElementById('canvas'),
    fpsInterval,
    now,
    elapsed,
    then,
    startTime,
    fps = 24,
    play = true,
    iteration = 0,
    darkMode = true,
    throttled = false,
    timeout = null,
    centre,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    lightBackground = '#FF4100',
    darkBackground = '#16130c',
    colours = ['#FF4100', '#16130c', '#E8E5D7'],
    x,
    y,
    wave,
    waveWidths = [],
    step = 5
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
    x = -200;
    y = -50;
    let totalWidth = -100;
    while(totalWidth < width + 300) {
        const waveWidth = ~~(Math.random() * 50) + 30;
        waveWidths.push(waveWidth);
        totalWidth += waveWidth;
    }
    wave = new Wave(
        new Point(x, y),
        Math.PI / 45,
        step,
        height + 50,
    );
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
    let xOffset = -200;
    const points = wave.points;
    for(let i = 0; i < waveWidths.length; i++) {
        const waveWidth = waveWidths[i];
        context.fillStyle = colours[(i + 1) % colours.length];
        const region = new Path2D();
        region.moveTo(xOffset + points[0].x, points[0].y);
        for(const point of points) {
            region.lineTo(xOffset + point.x, point.y);
        }
        for(let i = points.length - 1; i >= 0; i--) {
            region.lineTo(xOffset + points[i].x + waveWidth, points[i].y);
        }
        region.lineTo(xOffset + points[0].x, points[0].y);
        region.closePath();
        context.fill(region);
        context.fillStyle = colours[i % colours.length];
        for(let i = 0; i < points.length; i += 8) {
            if(i > points.length) break;
            context.beginPath();
            context.arc(xOffset + points[i].x + waveWidth / 2, points[i].y, waveWidth * 0.2, 0, TAU, true);
            context.fill();
        }
        xOffset += waveWidth;
    }
    wave.update(12);
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
