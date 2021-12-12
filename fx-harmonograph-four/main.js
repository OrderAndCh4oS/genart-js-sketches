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
    const selectedColours = shuffle(colourSet.colours);

    const mode = fxrand();
    const darkMode = mode > 0.5;
    const blendMode = darkMode ? 'screen' : 'multiply';
    const background = darkMode ? colourSet.black : colourSet.white;

    if(colourSet.name === 'Constructivist' && darkMode) {
        selectedColours.push(colourSet.white)
    }

    if(colourSet.name === 'Constructivist' && !darkMode) {
        selectedColours.push(colourSet.black)
    }

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

    function initHarmonographs() {
        harmonographs = [];
        // iteration = 0;
        for(let i = 0; i < 20; i++) {
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
    }

    function initialise() {
        iteration = 0;
        left = width * 0.1;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centre = new Point(0, 0);
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        diagonalLength = Math.sqrt(width * width + height * height);
        context.lineWidth = 1;
        maxArcMap = diagonalLength * 0.5;
        radius = diagonalLength * 0.002;
        nodes = [];
        initHarmonographs();
        context.translate(0, height / 2);
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function update() {
        if(left > width * 1.5) {
            left = width * 0.1;
            initHarmonographs();
        }
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = background;
        context.fillRect(0, -(height / 2), width, height);
        context.globalCompositeOperation = blendMode;
        for(let i = 0; i < harmonographs.length; i++) {
            squiggle(harmonographs[i], i);
        }

        const kdTree = new KdTree(nodes);
        for(let i = nodes.length - 1; i > 0; i--) {
            const node = nodes[i];
            const nearest = kdTree.findKnnInRadius(7, 300, node);
            for(const n of nearest) {
                n.point.pullTo(node, 0.2, 200);
                node.point.pushFrom(n, 0.1, 300)
            }
            if(isInBounds(node, width, height)) continue;
            nodes.splice(i, 1);
        }

        for(let node of nodes) {
            const nearest = kdTree.findKnnInRadius(7, 300, node);

            for(const n of nearest) {
                const d = node.distanceTo(n);
                const index = ~~map(d, 0, 250, 0, selectedColours.length, 0.6, Ease.EASE_IN);
                context.strokeStyle = selectedColours[index];
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(n.x, n.y);
                context.stroke();
            }
            drawPoint(node);
        }

        left += 30;
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
        context.fillStyle = darkMode ? colourSet.white : colourSet.colours[0];
        context.beginPath();
        context.arc(
            p.x,
            p.y,
            2,
            0,
            TAU,
            true
        );
        context.fill();
    }

    function isInBounds(p, w, h) {
        return !(p.x < 0 || p.y < -(h / 2) || p.x > w || p.y > h / 2);
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = ~~(fxrand() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
})();
