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
        iteration = 0,
        diagonalLength,
        colourSet,
        selectedColours,
        background,
        params,
        paramSettingsKeys
    ;

    const defaultParams = {
        colourIndex: 0
    };

    const paramSettings = {
        colourIndex: {
            min: 0,
            max: colours.length - 1,
            increment: 1,
            forward: Math.random() > 0.5
        },
    };

    params = {...defaultParams};
    paramSettingsKeys = Object.keys(paramSettings);

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    setColours(params.colourIndex);

    window.showCurrentParams = () => {
        console.log(params);
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
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        diagonalLength = Math.sqrt(width * width + height * height);
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function update() {
        context.fillStyle = colourSet.colours[0];
        context.strokeStyle = colourSet.colours[0];
        context.stroke();
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

    function setColours(colourIndex, isShuffle = false) {
        colourSet = colours[colourIndex];
        selectedColours = isShuffle
            ? [...shuffle(colourSet.colours)]
            : [...colourSet.colours];
        background = params.darkMode ? colourSet.black : colourSet.white;
        if(!params.darkMode) {
            if(colourSet.name === 'Constructivist') {
                selectedColours.push(colourSet.black);
            }
            selectedColours.push(colourSet.white);
        } else {
            selectedColours.push(colourSet.black);

            if(colourSet.name === 'Constructivist') {
                selectedColours.push(colourSet.white);
            }
        }
    }

    function shuffle(arr) {
        for(let i = arr.length - 1; i > 0; i--) {
            const j = ~~(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
})();
