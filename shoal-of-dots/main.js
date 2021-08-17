const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let throttled = false,
    timeout = null,
    width,
    height,
    centre,
    fpsInterval,
    now,
    elapsed,
    then,
    fps = 60,
    startTime,
    play = true,
    darkMode = true,
    darkBackground = '#FF4100',
    lightBackground = '#E8E5D7',
    colours = ['#16130c', '#E8E5D7'],
    points = [],
    aD = 1,
    bD = 0,
    cD = 1,
    dD = 0,
    a,
    b,
    c,
    d,
    m
;

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.backgroundColor = darkMode ? darkBackground : lightBackground;
    colours = darkMode ? ['#16130c', '#E8E5D7'] : ['#16130c', '#FF4100'];
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
        toggleDarkMode();
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

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
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

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    aD = 1;
    bD = 0;
    cD = 1;
    dD = 0;
    a = Math.random() * 6;
    b = Math.random() * 6;
    c = Math.random() * 6;
    d = Math.random() * 6;
    points = [];
    for(let i = 0; i < 750; i += 1) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
        });
    }
}

function calc(x, xD) {
    let m = Math.random() * 0.02 + 0.01;
    if(x < 0.01) xD = 1;
    else if(x > 5.99) xD = 0;
    if(xD === 0) m = -m;
    return [(x + m), xD];
}

function update() {
    context.clearRect(0, 0, width, height);

    [a, aD] = calc(a, aD);
    [b, bD] = calc(b, bD);
    [c, cD] = calc(c, cD);
    [d, dD] = calc(d, dD);

    context.lineWidth = 15;
    context.lineCap = 'round';

    for(let i = 0; i < points.length; i++) {
        const point = points[i];
        const value = getValue(point.x, point.y);
        point.vx += Math.cos(value) * 0.3;
        point.vy += Math.sin(value) * 0.3;
        context.strokeStyle = colours[i % colours.length];
        context.beginPath();
        context.moveTo(point.x, point.y);
        point.x += point.vx;
        point.y += point.vy;
        context.lineTo(point.x, point.y);
        context.stroke();
        point.vx *= 0.99;
        point.vy *= 0.99;
        if(point.x > width) point.x = 0;
        else if(point.x < 0) point.x = width;
        if(point.y > height) point.y = 0;
        else if(point.y < 0) point.y = height;
    }
}

function getValue(x, y) {
    x = (x - width / 2) * 0.004;
    y = (y - height / 2) * 0.004;

    const x1 = Math.sin((a - 4) * y) + (c - 4) * Math.cos((a - 4) * x);
    const y1 = Math.sin((b - 4) * x) + (d - 4) * Math.cos((b - 4) * y);

    return Math.atan2(y1 - y, x1 - x);
}
