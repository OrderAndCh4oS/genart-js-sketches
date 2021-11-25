(document.onload = () => {
    const TAU = Math.PI * 2;

    let canvas = document.getElementById('canvas'),
        throttled = false,
        timeout = null,
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        context = canvas.getContext('2d'),
        count = 250,
        radius = 1.25,
        particles,
        centre,
        circleRadius,
        fpsInterval,
        now,
        elapsed,
        then,
        startTime,
        fps = 24,
        play = true
    ;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.8, Ease.EASE_OUT);
    const colourSet = colours[colourIndex];
    const mode = fxrand();
    const darkMode = mode > 0.66;
    const background = darkMode
        ? colourSet.black
        : colourSet.white;
    document.body.style.backgroundColor = background;
    const selectedColours = [...colourSet.colours];

    const blendMode = darkMode
            ? 'screen'
            : 'multiply';

    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'No. of Colours': selectedColours.length,
        'Mode': darkMode ? 'Dark' : 'Light',
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
        centre = new Point(width / 2, height / 2);
        circleRadius = width / 2 * 0.8;
        particles = Array(count)
            .fill(0)
            .map(() => new Particle(
                (Math.random() * (width - radius * 2)) + radius,
                (Math.random() * (height - radius * 2)) + radius,
                0,
                Math.random() * TAU,
                0,
                1,
                Math.random() * 4 + 1
            ));
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function drawPoints() {
        context.lineWidth = radius * 2 - 8;
        const kdTree = new KdTree(particles);
        for(let i = 0; i < particles.length; i++) {
            context.strokeStyle = selectedColours[i % selectedColours.length];
            const particle = particles[i];
            const nearestPoints = kdTree.findKnnInRadius(3, 150, particle);
            context.beginPath();
            for(const nearest of nearestPoints) {
                nearest.gravitateTo(particle);
                context.moveTo(particle.x, particle.y);
                context.lineTo(nearest.x, nearest.y);
                context.globalCompositeOperation = blendMode;
                context.stroke();
            }
        }

        for(let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            context.fillStyle = selectedColours[i % selectedColours.length];
            context.beginPath();
            context.arc(particle.x, particle.y, radius, 0, TAU, true);
            context.globalCompositeOperation = 'source-over';
            context.fill();
        }
    }

    function update() {
        for(const particle of particles) {
            particle.update();
            if(particle.position.x > width - radius || particle.position.x <
                radius) particle.velocity.x = -particle.velocity.x;
            if(particle.position.y > height - radius || particle.position.y <
                radius) particle.velocity.y = -particle.velocity.y;
        }
        drawPoints();
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
