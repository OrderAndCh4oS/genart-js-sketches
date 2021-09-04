let
    trees = []
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

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centre = new Point(width / 2, height / 2);
    context.clearRect(0, 0, width, height);
    trees = [];
    for(let i = 0; i < 16; i++) {
        const tree = new Tree(Math.random() * width, Math.random() * height, darkMode ? 0.5 : 1, darkMode ? 1.01 : 1.1);
        tree.init()
        trees.push(tree);
    }
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

function update() {
    context.clearRect(0, 0, width, height);

    for(let i = 0; i < trees.length; i++) {
        let tree = trees[i];
        if(i % 2 === 0) {
            context.strokeStyle = darkMode ? redAlpha : blackAlpha;
        } else {
            context.strokeStyle = darkMode ? whiteAlpha : whiteAlpha;
        }
        tree.update();
        tree.draw();
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
