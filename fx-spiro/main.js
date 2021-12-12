(document.onload = () => {
    const TAU = Math.PI * 2;
    const PI = Math.PI;

    let canvas = document.getElementById('canvas'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        context = canvas.getContext('2d'),
        throttled = false,
        timeout = null,
        fpsInterval,
        now,
        elapsed,
        then,
        fps = 30,
        startTime,
        play = true,
        spiros = []
    ;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.66, Ease.EASE_OUT);
    const colourSet = colours[colourIndex];
    const mode = fxrand();
    const darkMode = mode > 0.66;
    const blackAndWhite = mode > 0.95;
    const blackAndWhitePure = mode > 0.98;
    let background = darkMode
        ? colourSet.black
        : colourSet.white;
    background = blackAndWhite
        ? colourSet.colours[~~(fxrand() * colourSet.colours.length)]
        : background;
    document.body.style.backgroundColor = background;
    let spiroColours = blackAndWhite
        ? [colourSet.white, colourSet.black]
        : [...colourSet.colours];

    if(blackAndWhitePure && mode >= 0.99) {
        spiroColours = [colourSet.white]
        background = colourSet.black
    }

    if(blackAndWhitePure && mode < 0.99) {
        spiroColours = [colourSet.black]
        background = colourSet.white
    }

    const isBlend = !blackAndWhite && !blackAndWhitePure && fxrand() > 0.75;
    const blendMode = !isBlend
        ? 'source-over'
        : darkMode
            ? 'screen'
            : 'multiply';

    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'No. of Colours': spiroColours.length,
        'Mode': blackAndWhitePure ? 'Pure Black & White' : blackAndWhite ? 'Black & White' : darkMode ? 'Dark' : 'Light',
        'Blend Mode': !isBlend ? 'Normal' : darkMode ? 'Screen' : 'Multiply'
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
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        spiros = [];
        for(let x = width / 12; x < width; x += width / 6) {
            for(let y = height / 12; y < height; y += height / 6) {
                spiros.push(new Spiro(
                    x,
                    y,
                    spiroColours[~~(fxrand() * spiroColours.length)],
                    true
                ));
            }
        }
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function update() {
        const radius = width / 800;
        for(const spiro of spiros) {
            spiro.update();
            context.globalCompositeOperation = blendMode;
            context.fillStyle = spiro.colour;
            context.beginPath();
            context.arc(spiro.x, spiro.y, radius, 0, TAU, true);
            context.fill();
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
    }
})();
