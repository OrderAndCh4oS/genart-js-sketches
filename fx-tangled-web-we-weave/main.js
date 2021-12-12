(document.onload = () => {
    const TAU = Math.PI * 2;

    let canvas = document.getElementById('canvas'),
        throttled = false,
        timeout = null,
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        context = canvas.getContext('2d'),
        fpsInterval,
        now,
        elapsed,
        then,
        startTime,
        fps = 24,
        play = true,
        centre,
        iteration = 0,
        radius,
        nodes,
        isFillMode = true,
        feedRate = 10,
        killRate = 0.05,
        currentColour,
        currentColourIndex
    ;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.975, Ease.EASE_OUT);
    const colourSet = colours[colourIndex];
    const selectedColours = shuffle(colourSet.colours);
    const mode = fxrand();
    const darkMode = mode > 0.5;
    const background = darkMode ? colourSet.black : colourSet.white;
    const dotIndex = ~~map(fxrand(), 0, 1, 0, selectedColours.length, 1, Ease.EASE_OUT);

    if(!darkMode) {
        if(colourSet.name === 'Constructivist') selectedColours.push(colourSet.black)
        selectedColours.push(colourSet.white)
    } else {
        if(colourSet.name === 'Constructivist') selectedColours.push(colourSet.white)
        selectedColours.push(colourSet.black)
    }

    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'Mode': darkMode ? 'Dark' : 'Light',
    };

    window.onclick = function() {
        initialise();
        update();
    };

    window.onkeyup = function(e) {
        if(e.code === 'Space') {
            play = !play;
        }
        if(e.code === 'KeyM') {
            isFillMode = !isFillMode;
        }
        if(e.code === 'KeyQ') {
            if(feedRate > 0) feedRate--;
        }
        if(e.code === 'KeyW') {
            if(feedRate < 20) feedRate++;
        }
        if(e.code === 'KeyZ') {
            if(killRate > 0.005) killRate -= 0.005;
        }
        if(e.code === 'KeyX') {
            if(killRate < 0.2) killRate += 0.005;
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

    function initialise() {
        iteration = 0;
        left = 0;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centre = new Point(0, 0);
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        diagonalLength = Math.sqrt(width * width + height * height);
        context.lineWidth = 3;
        maxArcMap = diagonalLength * 0.5;
        radius = diagonalLength * 0.002;
        nodes = [];
        currentColourIndex = 0
        currentColour = colourSet.colours[currentColourIndex]
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function update() {
        currentColour = colourSet.colours[currentColourIndex]
        if(iteration % 8 === 0) currentColourIndex = (currentColourIndex + 1) % colourSet.colours.length;
        if(!isFillMode) {
            context.fillStyle = background;
            context.fillRect(0, 0, width, height);
        }
        const kdTree = new KdTree(nodes);

        for(let i = 0; i < feedRate; i++) {
            nodes.push(new Node(
                fxrand() * width,
                fxrand() * height,
                fxrand() * 300 + 100,
                fxrand() * 100 + 250,
                fxrand() * 150 + 150,
                fxrand() * 200 + 200,
                fxrand() * 4 + 3,
                fxrand() * 0.015 + 0.005,
            ));
        }

        const deadNodes = [];

        for(let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            node.decrementLifeTime();

            if(node.lifeTime === 0 || !isInBounds(node, width, height) || fxrand() < killRate) {
                deadNodes.push(i);
            }

            const nearest = kdTree.findKnnInRadius(node.connections, node.reach, node);

            for(const n of nearest) {
                n.point.pullTo(node, node.force, node.attract);
                node.point.pushFrom(n, node.force / 2, node.repel)
            }
            context.globalAlpha = isFillMode ? 0.66 : 1;
            for(const n of nearest) {
                context.lineWidth = 1.25;
                const d = node.distanceTo(n);
                if(!isFillMode) {
                    context.lineWidth = ~~map(d, 0, node.reach, 2.5, 0.5, 0.66, Ease.EASE_OUT);
                    const index = ~~map(d, 0, node.reach, 0, selectedColours.length, 1, Ease.EASE_IN);
                    context.strokeStyle = selectedColours[index];
                } else {
                    context.strokeStyle = currentColour;
                }
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(n.x, n.y);
                context.stroke();
            }
            drawPoint(node);
        }

        for(const deadNode of deadNodes) {
            nodes.splice(deadNode, 1);
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

    function drawPoint(p) {
        context.fillStyle = isFillMode ? currentColour : selectedColours[dotIndex];
        context.beginPath();
        context.arc(
            p.x,
            p.y,
            3,
            0,
            TAU,
            true
        );
        context.fill();
    }

    function isInBounds(p, w, h) {
        return !(p.x < -100 || p.y < -100 || p.x > w + 100 || p.y > h + 100);
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = ~~(fxrand() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
})();
