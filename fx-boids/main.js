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
    const darkMode = mode > 0.45;
    const blackAndWhite = mode > 0.8;
    const colourSet = colours[colourIndex];
    const selectedColours = shuffle(
        blackAndWhite
            ? [colourSet.black, colourSet.white]
            : colourSet.colours
    );
    modeIndex = ~~(fxrand() * 4);

    const background = blackAndWhite
        ? colourSet.colours[~~(fxrand() * colourSet.colours.length)]
        : darkMode ? colourSet.black : colourSet.white;

    if(colourSet.name === 'Constructivist') {
        selectedColours.push(colourSet.white);
    }

    const altColour = blackAndWhite ? background : colourSet.black

    const flockData = new FlockData(context, width, height, selectedColours, altColour);

    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'Mode': blackAndWhite ? 'Black & White' : darkMode ? 'Dark' : 'Light',
        'Draw Mode': ['Lines', 'Dots', 'Tubes', 'Crosses'][modeIndex],
        'Tail': [0, 2].includes(modeIndex) ? 'None' : flockData.fxFeatures.Tail,
        'Scale Type': flockData.fxFeatures['Scale Type'],
        'Scale Modifier': flockData.fxFeatures['Scale Modifier'],
        'Boid Starting Position': flockData.fxFeatures['Boid Positions'],
        'Parameter Set': flockData.fxFeatures['Unit Set']
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
            modeIndex = (modeIndex + 1) % 4;
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
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        flockData.setupBoids();
        flock = new Flock(flockData, centre);
        flock.init();
    }

    function update() {
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
