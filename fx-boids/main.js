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
        flock,
        modeIndex = 0
    ;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 1, Ease.EASE_OUT);
    const mode = fxrand();
    const darkMode = mode > 0.5;
    const blackAndWhite = mode > 0.96;
    const blendMode = fxrand() < 0.5 || blackAndWhite
        ? 'source-over'
        : darkMode
            ? 'screen'
            : 'multiply';
    const colourSet = colours[colourIndex];
    const selectedColours = shuffle(
        blackAndWhite
            ? [colourSet.black, colourSet.white]
            : colourSet.colours
    );
    modeIndex = ~~(fxrand() * 5);

    const background = blackAndWhite
        ? colourSet.colours[~~(fxrand() * colourSet.colours.length)]
        : darkMode ? colourSet.black : colourSet.white;

    if(colourSet.name === 'Constructivist' && darkMode) {
        selectedColours.push(colourSet.white);
    }

    if(colourSet.name === 'Constructivist' && !darkMode) {
        selectedColours.push(colourSet.black);
    }

    const altColour = blackAndWhite ? background : colourSet.black

    const flockData = new FlockData(context, width, height, selectedColours, blendMode, altColour);

    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'Mode': blackAndWhite ? 'Black & White' : darkMode ? 'Dark' : 'Light',
        'Blend Mode': blendMode === 'source-over'
            ? 'Normal'
            : blendMode[0].toUpperCase() + blendMode.slice(1),
        ...flockData.fxFeatures
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
            modeIndex = (modeIndex + 1) % 5;
            initialise();
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

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
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

    function initialise() {
        iteration = 0;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centre = new Point(width / 2, height / 2);
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        flockData.setupBoids();
        flock = new Flock(flockData, centre);
        flock.init();
    }

    function update() {
        context.globalCompositeOperation = blendMode;
        flock.draw(modeIndex);
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
