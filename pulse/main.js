let
    tree,
    treeTwo
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
    context.clearRect(0, 0, width, height);
    tree = new Tree(width / 2, height);
    treeTwo = new Tree(width / 2, 0);
    freeze = 0;
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    currentBackgroundAlpha = darkMode ? `rgba(22,19,12,${(freeze - 24) * 0.125})` : `rgba(255,65,0,${(freeze - 24) * 0.125})`;
    context.clearRect(0, 0, width, height);
    tree.update();
    treeTwo.update();
    context.fillStyle = darkMode ? white : black;
    context.strokeStyle = darkMode ? whiteAlpha : blackAlpha
    tree.draw();
    context.fillStyle = darkMode ? red : white;
    context.strokeStyle = darkMode ? redAlpha : whiteAlpha
    treeTwo.draw();
    if(tree.finished && treeTwo.finished) {
        freeze++;
        if(freeze > 24) {
            context.fillStyle = currentBackgroundAlpha;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        if(freeze > maxFreeze) {
            freeze = 0;
            tree.init()
            treeTwo.init()
        }
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
