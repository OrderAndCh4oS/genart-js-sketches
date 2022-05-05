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
        values = [],
        maxArcMap
    ;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.8, Ease.EASE_OUT);
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
        : [...colourSet.colours];

    if(blackAndWhitePure && mode >= 0.99) {
        selectedColours = [colourSet.white];
        background = colourSet.black;
    }

    if(blackAndWhitePure && mode < 0.99) {
        selectedColours = [colourSet.black];
        background = colourSet.white;
    }

    if(colourSet.name === 'Constructivist' && darkMode) {
        selectedColours.push(colourSet.white)
    }

    if(colourSet.name === 'Constructivist' && !darkMode) {
        selectedColours.push(colourSet.black)
    }


    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'Mode': blackAndWhitePure
            ? 'Pure Black & White'
            : blackAndWhite
                ? 'Black & White'
                : darkMode ? 'Dark' : 'Light',
    };

    window.onclick = function(event) {
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
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centre = new Point(0, 0);
        context.fillStyle = background;
        context.fillRect(-width / 2, -height / 2, width, height);
        diagonalLength = Math.sqrt(width * width + height * height);
        maxArcMap = diagonalLength * 0.5;
        radius = diagonalLength * 0.025;
        values = [];
        for (let i = 0; i < 8; i++) {
            values.push(getValues())
        }

        context.translate(width / 2, height / 2);
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function update() {
        context.fillStyle = background;
        context.fillRect(-width / 2, -height / 2, width, height);
        for(let i = 0; i < values.length; i++){
            squiggle(i);
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

    function squiggle(index) {
        const {
            frequencyXA, phaseXA, amplitudeXA, dampingXA,
            frequencyXB, phaseXB, amplitudeXB, dampingXB,
            frequencyYA, phaseYA, amplitudeYA, dampingYA,
            frequencyYB, phaseYB, amplitudeYB, dampingYB
        } = values[index];
        const xA = new Harmonograph(frequencyXA, phaseXA, amplitudeXA, dampingXA);
        const xB = new Harmonograph(frequencyXB, phaseXB, amplitudeXB, dampingXB);
        const yA = new Harmonograph(frequencyYA, phaseYA, amplitudeYA, dampingYA);
        const yB = new Harmonograph(frequencyYB, phaseYB, amplitudeYB, dampingYB);
        let scale = 1;
        const points = [];
        let i = iteration * 3;
        const steps = i + 250;
        for(; i < steps; i++) {
            const x = xA.getValue(i / 30) + xB.getValue(i / 30);
            const y = yA.getValue(i / 30) + yB.getValue(i / 30);
            points.push(new Point(x, y));
        }

        context.strokeStyle = colourSet.black;
        context.lineWidth = 1;

        for(let j = 1; j < points.length; j++) {
            let p = points[j];
            context.fillStyle = selectedColours[~~(index % selectedColours.length)];
            const d = p.distanceTo(centre);
            context.beginPath();
            context.arc(p.x, p.y, map(d, 0, maxArcMap, 3, radius, 0.5, Ease.EASE_OUT), 0, TAU, true);
            context.fill();
            context.beginPath();
            context.arc(-p.x, p.y, map(d, 0, maxArcMap, 3, radius, 0.5, Ease.EASE_OUT), 0, TAU, true);
            context.fill();
            scale *= 0.9999;
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
        }
    }

    function sinWave(t, speed, scale = 1) {
        return Math.abs(Math.sin(t * speed)) * scale;
    }
})();
