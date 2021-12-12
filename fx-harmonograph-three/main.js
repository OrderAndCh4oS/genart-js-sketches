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
        harmonographs,
        nodes,
        maxArcMap,
        left
    ;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 1,
        Ease.EASE_OUT);
    const colourSet = colours[colourIndex];
    const selectedColours = colourSet.colours;
    const mode = fxrand();
    const darkMode = mode > 0.5;
    const blendMode = darkMode ? 'screen' : 'multiply';
    const background = darkMode ? colourSet.black : colourSet.white;

    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'Mode': darkMode ? 'Dark' : 'Light'
    };

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
        harmonographs = [];
        nodes = [];
        for(let i = 0; i < 30; i++) {
            harmonographs.push({
                frequencyXA: fxrand() * 0.9 + 0.05,
                frequencyXB: fxrand() * 0.9 + 0.05,
                frequencyYA: fxrand() * 0.9 + 0.05,
                frequencyYB: fxrand() * 0.9 + 0.05,
                phaseXA: (((fxrand() * 125) + 175) * diagonalLength) / 1250,
                phaseXB: (((fxrand() * 125) + 175) * diagonalLength) / 1250,
                phaseYA: (((fxrand() * 125) + 175) * diagonalLength) / 1250,
                phaseYB: (((fxrand() * 125) + 175) * diagonalLength) / 1250,
                amplitudeXA: (((fxrand() * 125) + 175) * diagonalLength) / 1250,
                amplitudeXB: (((fxrand() * 125) + 175) * diagonalLength) / 1250,
                amplitudeYA: (((fxrand() * 125) + 175) * diagonalLength) / 1250,
                amplitudeYB: (((fxrand() * 125) + 175) * diagonalLength) / 1250,
                dampingXA: (fxrand() * 0.0095) + 0.0005,
                dampingXB: (fxrand() * 0.0095) + 0.0005,
                dampingYA: (fxrand() * 0.0095) + 0.0005,
                dampingYB: (fxrand() * 0.0095) + 0.0005
            });
        }

        context.translate(0, height / 2);
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function update() {
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = background;
        context.fillRect(0, -(height / 2), width, height);
        context.globalCompositeOperation = blendMode;
        if(nodes.length < 500) {
            for(let i = 0; i < harmonographs.length; i++) {
                squiggle(harmonographs[i], i);
            }
        }

        for(let i = nodes.length - 1; i > 0; i--) {
            if(isInBounds(nodes[i])) continue;
            nodes.splice(i, 1);
        }

        const kdTree = new KdTree(nodes);

        for(let node of nodes) {
            const nearest = kdTree.findKnnInRadius(8, 200, node);

            for(const n of nearest) {
                n.point.pullTo(node, 0.2, 50);
                node.point.pushFrom(n, 0.1, 150)
            }

            for(const n of nearest) {
                const d = node.distanceTo(n);
                const index = ~~map(d, 0, 200, 0, selectedColours.length, 0.5, Ease.EASE_IN);
                context.strokeStyle = selectedColours[index];
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(n.x, n.y);
                context.stroke();
            }
            drawPoint(node);
        }

        left += 25;
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

    function squiggle(data) {
        const xA = new Harmonograph(data.frequencyXA, data.phaseXA,
            data.amplitudeXA, data.dampingXA);
        const xB = new Harmonograph(data.frequencyXB, data.phaseXB,
            data.amplitudeXB, data.dampingXB);
        const yA = new Harmonograph(data.frequencyYA, data.phaseYA,
            data.amplitudeYA, data.dampingYA);
        const yB = new Harmonograph(data.frequencyYB, data.phaseYB,
            data.amplitudeYB, data.dampingYB);
        let i = iteration;
        const x = xA.getValue(i * 5) + xB.getValue(i * 5);
        const y = yA.getValue(i * 5) + yB.getValue(i * 5);
        nodes.push(new Node(x + left, y));
    }

    function drawPoint(p) {
        context.fillStyle = selectedColours[0];
        const d = p.distanceTo(centre);
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
        return !(p.x < 0 || p.y < -(h / 2) || p.x > w || p.y > h / 2);
    }
})();
