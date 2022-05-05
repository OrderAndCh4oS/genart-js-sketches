(document.onload = () => {
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
        isReverse = false,
        radius,
        values = [],
        nodes = [],
        maxArcMap,
        isFillMode = false
    ;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.8,
        Ease.EASE_OUT);
    const colourSet = colours[colourIndex];
    const mode = fxrand();
    const darkMode = mode > 0.5;
    const blackAndWhite = mode > 0.83;
    const blackAndWhitePure = mode > 0.95;
    let background = darkMode
        ? colourSet.black
        : colourSet.white;
    background = blackAndWhite
        ? colourSet.colours[~~(fxrand() * colourSet.colours.length)]
        : background;
    document.body.style.backgroundColor = background;
    let selectedColours = blackAndWhite
        ? [colourSet.white, colourSet.black]
        : shuffle([...colourSet.colours]);

    if(blackAndWhitePure && mode >= 0.975) {
        selectedColours = [colourSet.white];
        background = colourSet.black;
    }

    if(blackAndWhitePure && mode < 0.975) {
        selectedColours = [colourSet.black];
        background = colourSet.white;
    }

    if(colourSet.name === 'Constructivist' && darkMode) {
        selectedColours.push(colourSet.white);
    }

    if(colourSet.name === 'Constructivist' && !darkMode) {
        selectedColours.push(colourSet.black);
    }

    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'Mode': blackAndWhitePure
            ? 'Pure Black & White'
            : blackAndWhite
                ? 'Black & White'
                : darkMode ? 'Dark' : 'Light'
    };

    window.onclick = function(event) {
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
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centre = new Node(0, 0);
        context.globalAlpha = 1;
        context.fillStyle = background;
        context.translate(width / 2, height / 2);
        context.fillRect(-width / 2, -height / 2, width, height);
        context.lineWidth = 0.75;
        diagonalLength = Math.sqrt(width * width + height * height);
        maxArcMap = diagonalLength * 0.5;
        radius = diagonalLength * 0.025;
        values = [];
        for(let i = 0; i < 15; i++) {
            values.push(getValues());
        }
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function update() {
        // context.globalAlpha = 0.01;
        // if(!isFillMode) {
        //     context.fillStyle = background;
        //     context.fillRect(-width / 2, -height / 2, width, height);
        // }
        context.globalAlpha = 0.2;
        nodes = [];
        for(let i = 0; i < values.length; i++) {
            squiggle(i);
        }
        const kdTree = new KdTree(nodes);
        for(const node of nodes) {
            const nearest = kdTree.findKnn(12, node);
            for(const n of nearest) {
                const d = node.distanceTo(n);
                const index = ~~map(d, 0, 125, 0, selectedColours.length, 1, Ease.EASE_IN);
                context.strokeStyle = selectedColours[index];
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(n.x, n.y);
                context.stroke();
            }
        }
    }

    function render() {
        // if(iteration >= 250) return;
        requestAnimationFrame(render);
        now = Date.now();
        elapsed = now - then;
        if(elapsed <= fpsInterval) return;
        then = now - (elapsed % fpsInterval);
        if(!play) return;
        update();
        iteration++;
    }

    function squiggle(index) {
        const {
            frequencyXA, phaseXA, amplitudeXA, dampingXA,
            frequencyXB, phaseXB, amplitudeXB, dampingXB,
            frequencyYA, phaseYA, amplitudeYA, dampingYA,
            frequencyYB, phaseYB, amplitudeYB, dampingYB
        } = values[index];
        const xA = new Harmonograph(frequencyXA, phaseXA, amplitudeXA,
            dampingXA);
        const xB = new Harmonograph(frequencyXB, phaseXB, amplitudeXB,
            dampingXB);
        const yA = new Harmonograph(frequencyYA, phaseYA, amplitudeYA,
            dampingYA);
        const yB = new Harmonograph(frequencyYB, phaseYB, amplitudeYB,
            dampingYB);
        let i = iteration * 1.25;
        const steps = i + 2;
        for(; i < steps; i++) {
            const x = xA.getValue(i * 0.025) + xB.getValue(i * 0.025);
            const y = yA.getValue(i * 0.025) + yB.getValue(i * 0.025);
            nodes.push(new Node(x, y));
            nodes.push(new Node(-x, y));
        }
    }

    function getValues() {
        const frequencyXA = fxrand() * 0.9 + 0.05;
        const frequencyXB = fxrand() * 0.9 + 0.05;
        const frequencyYA = fxrand() * 0.9 + 0.05;
        const frequencyYB = fxrand() * 0.9 + 0.05;
        const phaseXA = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        const phaseXB = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        const phaseYA = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        const phaseYB = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        const amplitudeXA = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        const amplitudeXB = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        const amplitudeYA = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        const amplitudeYB = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        const dampingXA = (fxrand() * 0.0095) + 0.0005;
        const dampingXB = (fxrand() * 0.0095) + 0.0005;
        const dampingYA = (fxrand() * 0.0095) + 0.0005;
        const dampingYB = (fxrand() * 0.0095) + 0.0005;
        return {
            frequencyXA,
            frequencyXB,
            frequencyYA,
            frequencyYB,
            phaseXA,
            phaseXB,
            phaseYA,
            phaseYB,
            amplitudeXA,
            amplitudeXB,
            amplitudeYA,
            amplitudeYB,
            dampingXA,
            dampingXB,
            dampingYA,
            dampingYB
        };
    }

    function shuffle(arr) {
        let randomizedArray = [];
        let array = arr;
        while(array.length !== 0) {
            let rIndex = Math.floor(array.length * fxrand());
            randomizedArray.push(array[rIndex]);
            array.splice(rIndex, 1);
        }
        return randomizedArray;
    }
})();
