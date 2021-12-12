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
        isFillMode = false,
        feedRate = 8,
        killRate = 0.015
    ;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 1, Ease.EASE_OUT);
    const colourSet = colours[colourIndex];
    const selectedColours = colourSet.colours;
    const mode = fxrand();
    const darkMode = mode > 0.5;
    const blendMode = fxrand() < 0.5 ? 'source-over' : darkMode ? 'screen' : 'multiply';
    const background = darkMode ? colourSet.black : colourSet.white;

    if(colourSet.name === 'Constructivist' && darkMode) {
        selectedColours.push(colourSet.white)
    }

    if(colourSet.name === 'Constructivist' && !darkMode) {
        selectedColours.push(colourSet.black)
    }

    const dotIndex = ~~map(fxrand(), 0, 1, 0, selectedColours.length, 1, Ease.EASE_OUT);


    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'Mode': darkMode ? 'Dark' : 'Light',
        'Blend Mode': blendMode === 'source-over'
            ? 'Normal'
            : blendMode[0].toUpperCase() + blendMode.slice(1)
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
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        diagonalLength = Math.sqrt(width * width + height * height);
        context.lineWidth = 3;
        maxArcMap = diagonalLength * 0.5;
        radius = diagonalLength * 0.002;
        nodes = [];
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function update() {
        if(!isFillMode) {
            context.globalCompositeOperation = 'source-over';
            context.fillStyle = background;
            context.fillRect(0, 0, width, height);
        }
        const kdTree = new KdTree(nodes);

        for(let i = 0; i < feedRate; i++) {
            nodes.push(new Node(
                fxrand() * width,
                fxrand() * height,
                fxrand() * 200 + 50,
                fxrand() * 40 + 40,
                fxrand() * 15 + 15,
                fxrand() * 35 + 35,
                fxrand() * 20 + 5,
                fxrand() * 0.3 + 0.1,
            ));
        }

        const deadNodes = [];

        for(let i = nodes.length - 1; i >= 0; i--) {
            context.globalCompositeOperation = blendMode;

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

            for(const n of nearest) {
                const d = node.distanceTo(n);
                context.lineWidth = ~~map(d, 0, node.reach, 2, 0.25, 0.5, Ease.EASE_OUT);
                const index = ~~map(d, 0, node.reach, 0, selectedColours.length, 1, Ease.EASE_IN);
                context.strokeStyle = selectedColours[index];
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
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = selectedColours[dotIndex];
        context.beginPath();
        context.arc(
            p.x,
            p.y,
            1.75,
            0,
            TAU,
            true
        );
        context.fill();
    }

    function isInBounds(p, w, h) {
        return !(p.x < -100 || p.y < -100 || p.x > w + 100 || p.y > h + 100);
    }
})();
