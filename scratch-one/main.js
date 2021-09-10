let z = 0, v, scale;

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
    const diagonalLength = Math.sqrt(width * width + height * height);
    scale = darkMode ? diagonalLength * 0.066 : diagonalLength * 0.033;
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    context.clearRect(0, 0, width, height);

    for(let x = 0; x < width; x += scale + 1) {
        for(let y = 0; y < height; y += scale + 1) {
            const radius = (scale * v) / 2;
            if(!darkMode) {
                v = Math.abs(getValue(x, y, z)) / 2;

                context.fillStyle = white;
                context.fillRect(x, y, scale * v, scale * v);

                v = Math.abs(getValue(x, y, z + 0.0768)) / 3;

                context.fillStyle = black;
                context.beginPath();
                context.arc(x, y, radius, 0, TAU, true);
                context.fill();
            } else {
                v = Math.abs(getValue(x, y, z)) / 3;
                context.fillStyle = white;
                context.fillRect(x, y, scale * v * 0.55, scale * v * 0.55);

                v = Math.abs(getValue(x, y, z + 0.0768)) / 3;
                context.fillStyle = red;
                context.beginPath();
                context.arc(scale / 2 + x, scale / 2 + y, radius * 0.66, 0, TAU, true);
                context.fill();
            }
        }
    }
    z += 0.048;
    requestAnimationFrame(render);
}

function getValue(x, y, z) {
    const scale = 0.004;
    return noise.perlin3(x * scale, y * scale, z) * Math.PI * 2;
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
