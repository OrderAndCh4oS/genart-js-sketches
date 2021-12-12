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
        frequencyXA,
        phaseXA,
        amplitudeXA,
        dampingXA,
        frequencyXB,
        phaseXB,
        amplitudeXB,
        dampingXB,
        frequencyYA,
        phaseYA,
        amplitudeYA,
        dampingYA,
        frequencyYB,
        phaseYB,
        amplitudeYB,
        dampingYB,
        amplitudeXAStep,
        amplitudeYAStep,
        amplitudeXBStep,
        amplitudeYBStep,
        frequencyXAStep,
        frequencyYAStep,
        frequencyXBStep,
        frequencyYBStep,
        maxArcMap
    ;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.8, Ease.EASE_OUT);
    const colourSet = colours[colourIndex];
    const isChaos = fxrand() > 0.95;
    const mode = fxrand();
    const darkMode = mode > 0.5;
    const blackAndWhite = mode > 0.83;
    const blackAndWhitePure = mode > 0.98;
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

    const isBlend = !blackAndWhite && !blackAndWhitePure && fxrand() > 0.66;
    const blendMode = !isBlend
        ? 'source-over'
        : darkMode
            ? 'screen'
            : 'multiply';

    const armCount = ~~map(fxrand(), 0, 1, 5, 15, 0.66, Ease.EASE_OUT);

    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'Arm Count': armCount,
        'Mode': blackAndWhitePure
            ? 'Pure Black & White'
            : blackAndWhite
                ? 'Black & White'
                : darkMode ? 'Dark' : 'Light',
        'Blend Mode': !isBlend ? 'Normal' : darkMode ? 'Screen' : 'Multiply',
        'Type': isChaos ? 'Chaos' : 'Order'
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
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = background;
        context.fillRect(-width / 2, -height / 2, width, height);
        diagonalLength = Math.sqrt(width * width + height * height);
        maxArcMap = diagonalLength * 0.5;
        radius = diagonalLength * 0.02;
        frequencyXA = fxrand() * 0.9 + 0.05;
        frequencyXB = fxrand() * 0.9 + 0.05;
        frequencyYA = fxrand() * 0.9 + 0.05;
        frequencyYB = fxrand() * 0.9 + 0.05;
        phaseXA = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        phaseXB = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        phaseYA = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        phaseYB = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        amplitudeXA = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        amplitudeXB = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        amplitudeYA = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        amplitudeYB = (((fxrand() * 125) + 100) * diagonalLength) / 1250;
        dampingXA = (fxrand() * 0.0095) + 0.0005;
        dampingXB = (fxrand() * 0.0095) + 0.0005;
        dampingYA = (fxrand() * 0.0095) + 0.0005;
        dampingYB = (fxrand() * 0.0095) + 0.0005;

        amplitudeXAStep = fxrand() * 10 - 5;
        amplitudeYAStep = fxrand() * 10 - 5;
        amplitudeXBStep = fxrand() * 10 - 5;
        amplitudeYBStep = fxrand() * 10 - 5;
        frequencyXAStep = fxrand() * 0.3 - 0.15;
        frequencyYAStep = fxrand() * 0.3 - 0.15;
        frequencyXBStep = fxrand() * 0.3 - 0.15;
        frequencyYBStep = fxrand() * 0.3 - 0.15;

        while(Math.abs(frequencyXA - frequencyXB) < 0.2) {
            frequencyXB = fxrand();
        }

        while(Math.abs(frequencyYA - frequencyYB) < 0.2) {
            frequencyYB = fxrand();
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
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = background;
        context.fillRect(-width / 2, -height / 2, width, height);
        context.globalCompositeOperation = blendMode;
        if(isChaos) {
            const steppedAmplitudeXA = amplitudeXA + amplitudeXAStep;
            const steppedAmplitudeYA = amplitudeYA + amplitudeYAStep;
            const steppedAmplitudeXB = amplitudeXB + amplitudeXBStep;
            const steppedAmplitudeYB = amplitudeYB + amplitudeYBStep;
            const steppedFrequencyXA = frequencyXA + frequencyXAStep;
            const steppedFrequencyYA = frequencyYA + frequencyYAStep;
            const steppedFrequencyXB = frequencyXB + frequencyXBStep;
            const steppedFrequencyYB = frequencyYB + frequencyYBStep;
            const tempPhaseXA = width / 6 + sinWave(phaseXA + iteration, 0.003, 40);
            const tempPhaseXB = width / 6 + sinWave(phaseXB + iteration, 0.003, 40);
            const tempPhaseYA = height / 6 + sinWave(phaseYA + iteration, 0.003, 40);
            const tempPhaseYB = height / 6 + sinWave(phaseYB + iteration, 0.003, 40);
            const tempDampingXA = 0.0005 + sinWave(dampingXA + iteration, 0.04, 0.0095);
            const tempDampingXB = 0.0005 + sinWave(dampingXA + iteration, 0.04, 0.0095);
            const tempDampingYA = 0.0005 + sinWave(dampingXA + iteration, 0.04, 0.0095);
            const tempDampingYB = 0.0005 + sinWave(dampingXA + iteration, 0.04, 0.0095);

            squiggle(
                steppedFrequencyXA, tempPhaseXA, steppedAmplitudeXA, tempDampingXA,
                steppedFrequencyXB, tempPhaseXB, steppedAmplitudeXB, tempDampingXB,
                steppedFrequencyYA, tempPhaseYA, steppedAmplitudeYA, tempDampingYA,
                steppedFrequencyYB, tempPhaseYB, steppedAmplitudeYB, tempDampingYB
            );
        } else {
            squiggle(
                frequencyXA, phaseXA, amplitudeXA, dampingXA,
                frequencyXB, phaseXB, amplitudeXB, dampingXB,
                frequencyYA, phaseYA, amplitudeYA, dampingYA,
                frequencyYB, phaseYB, amplitudeYB, dampingYB
            );
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

    function squiggle(
        frequencyXA, phaseXA, amplitudeXA, dampingXA,
        frequencyXB, phaseXB, amplitudeXB, dampingXB,
        frequencyYA, phaseYA, amplitudeYA, dampingYA,
        frequencyYB, phaseYB, amplitudeYB, dampingYB
    ) {
        const xA = new Harmonograph(frequencyXA, phaseXA, amplitudeXA,
            dampingXA);
        const xB = new Harmonograph(frequencyXB, phaseXB, amplitudeXB,
            dampingXB);
        const yA = new Harmonograph(frequencyYA, phaseYA, amplitudeYA,
            dampingYA);
        const yB = new Harmonograph(frequencyYB, phaseYB, amplitudeYB,
            dampingYB);
        let scale = 1;
        const points = [];
        let i = iteration * 3;
        const steps = i + 350;
        for(; i < steps; i++) {
            const x = xA.getValue(i / 25) + xB.getValue(i / 25);
            const y = yA.getValue(i / 25) + yB.getValue(i / 25);
            points.push(new Point(x, y));
        }

        for(let j = 1; j < points.length; j++) {
            let p = points[j];
            for(let arm = 0; arm < armCount; arm++) {
                context.fillStyle = selectedColours[arm %
                selectedColours.length];
                const d = p.distanceTo(centre);
                context.beginPath();
                context.arc(p.x, p.y, map(d, 0, maxArcMap, 2, radius, 0.5, Ease.EASE_OUT), 0, TAU, true);
                context.fill();
                scale *= 0.9999;
                context.rotate(TAU / armCount);
            }
        }
    }

    function sinWave(t, speed, scale = 1) {
        return Math.abs(Math.sin(t * speed)) * scale;
    }
})();
