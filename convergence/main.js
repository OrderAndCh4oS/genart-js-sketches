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
        nodes,
        currentColour,
        currentColourIndex,
        attractors,
        colourSet,
        selectedColours,
        background,
        params,
        textTimeout,
        paramSettingsKeys
    ;

    const DrawType = Object.freeze({
        CLEAR: 0,
        TAIL: 1,
        KEEP: 2
    });

    const defaultParams = {
        colourIndex: 7,
        killRate: 0.05,
        feedRate: 10,
        force: 0.0012,
        attract: 90,
        repel: 400,
        reach: 270,
        connections: 8,
        lineWidth: 0.75,
        darkMode: true,
        drawType: DrawType.KEEP,
        playMode: false
    };

    const paramSettings = {
        colourIndex: {
            min: 0,
            max: colours.length - 1,
            increment: 1,
            forward: Math.random() > 0.5
        },
        killRate: {
            min: 0.05,
            max: 0.175,
            increment: 0.025,
            forward: Math.random() > 0.5
        },
        feedRate: {
            min: 1,
            max: 12,
            increment: 1,
            forward: Math.random() > 0.5
        },
        force: {
            min: 0.0003,
            max: 0.0024,
            increment: 0.0001,
            forward: Math.random() > 0.5
        },
        attract: {
            min: 50,
            max: 300,
            increment: 5,
            forward: Math.random() > 0.5
        },
        repel: {
            min: 100,
            max: 600,
            increment: 10,
            forward: Math.random() > 0.5
        },
        reach: {
            min: 200,
            max: 800,
            increment: 10,
            forward: Math.random() > 0.5
        },
        connections: {
            min: 3,
            max: 10,
            increment: 1,
            forward: Math.random() > 0.5
        },
        lineWidth: {
            min: 0.25,
            max: 12,
            increment: 0.25,
            forward: Math.random() > 0.5
        }
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
        if(e.code === 'KeyP') {
            params.playMode = !params.playMode;
        }
        if(e.code === 'KeyB') {
            params = {...defaultParams};
            showText(`Reset`);
            initialise();
            update();
            return;
        }
        if(e.code === 'KeyM') {
            switchDrawType();
            return;
        }
        if(e.code === 'KeyL') {
            params.darkMode = !params.darkMode;
            setColours(params.colourIndex, true);
            initialise();
            update();
            return;
        }
        if(e.code === 'KeyN') {
            params.colourIndex += 1;
            setColours(params.colourIndex % colours.length, true);
            initialise();
            update();
            return;
        }
        if(e.code === 'KeyQ') {
            if(params.feedRate > paramSettings.feedRate.min)
                params.feedRate -= paramSettings.feedRate.increment;
            showText(`Feed Rate: ${params.feedRate}`);
            return;
        }
        if(e.code === 'KeyW') {
            if(params.feedRate < paramSettings.feedRate.max)
                params.feedRate += paramSettings.feedRate.increment;
            showText(`Feed Rate: ${params.feedRate}`);
            return;
        }
        if(e.code === 'KeyA') {
            if(params.killRate > paramSettings.killRate.min)
                params.killRate -= paramSettings.killRate.increment;
            showText(`Kill Rate: ${params.killRate.toFixed(3)}`);
            return;
        }
        if(e.code === 'KeyS') {
            if(params.killRate < paramSettings.killRate.max)
                params.killRate += paramSettings.killRate.increment;
            showText(`Kill Rate: ${params.killRate.toFixed(3)}`);
            return;
        }
        if(e.code === 'KeyZ') {
            if(params.force > paramSettings.force.min)
                params.force -= paramSettings.force.increment;
            showText(`Force: ${params.force.toFixed(4)}`);
            return;
        }
        if(e.code === 'KeyX') {
            if(params.force < paramSettings.force.max)
                params.force += paramSettings.force.increment;
            showText(`Force: ${params.force.toFixed(4)}`);
            return;
        }
        if(e.code === 'KeyE') {
            if(params.reach > paramSettings.reach.min)
                params.reach -= paramSettings.reach.increment;
            showText(`Reach: ${params.reach}`);
            return;
        }
        if(e.code === 'KeyR') {
            if(params.reach < paramSettings.reach.max)
                params.reach += paramSettings.reach.increment;
            showText(`Reach: ${params.reach}`);
            return;
        }
        if(e.code === 'KeyD') {
            if(params.attract > paramSettings.attract.min)
                params.attract -= paramSettings.attract.increment;
            showText(`Attract: ${params.attract}`);
            return;
        }
        if(e.code === 'KeyF') {
            if(params.attract < paramSettings.attract.max)
                params.attract += paramSettings.attract.increment;
            showText(`Attract: ${params.attract}`);
            return;
        }
        if(e.code === 'KeyC') {
            if(params.repel > paramSettings.repel.min)
                params.repel -= paramSettings.repel.increment;
            showText(`Repel: ${params.repel}`);
            return;
        }
        if(e.code === 'KeyV') {
            if(params.repel < paramSettings.repel.max)
                params.repel += paramSettings.repel.increment;
            showText(`Repel: ${params.repel}`);
            return;
        }
        if(e.code === 'KeyT') {
            if(params.connections > paramSettings.connections.min)
                params.connections -= paramSettings.connections.increment;
            showText(`Connections: ${params.connections}`);
            return;
        }
        if(e.code === 'KeyY') {
            if(params.connections < paramSettings.connections.max)
                params.connections += paramSettings.connections.increment;
            showText(`Connections: ${params.connections}`);
            return;
        }
        if(e.code === 'KeyG') {
            if(params.lineWidth > paramSettings.lineWidth.min)
                params.lineWidth -= paramSettings.lineWidth.increment;
            showText(`Stroke: ${params.lineWidth}`);
            return;
        }
        if(e.code === 'KeyH') {
            if(params.lineWidth < paramSettings.lineWidth.max)
                params.lineWidth += paramSettings.lineWidth.increment;
            showText(`Stroke: ${params.lineWidth}`);
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
        attractors = [];
        for(let i = 0; i < 10; i++) {
            const point = new Point(Math.random() * width,
                Math.random() * height);
            attractors.push(point);
        }
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        diagonalLength = Math.sqrt(width * width + height * height);
        nodes = [];
        currentColourIndex = 0;
        currentColour = colourSet.colours[currentColourIndex];
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function update() {
        if(params.playMode) {
            const tweakParamKey = paramSettingsKeys[~~(Math.random() * paramSettingsKeys.length)];
            const settings = paramSettings[tweakParamKey];
            const param = params[tweakParamKey];
            if(settings.forward && param < settings.max) {
                params[tweakParamKey] += settings.increment;
            } else {
                settings.forward = false;
            }
            if(!settings.forward && param > settings.min) {
                params[tweakParamKey] -= settings.increment;
            } else {
                settings.forward = true;
            }
            if(tweakParamKey === 'colourIndex') setColours(params.colourIndex, true);
            if(Math.random() > 0.8) settings.forward = !settings.forward
        }
        switch(params.drawType) {
            case DrawType.KEEP:
                break;
            case DrawType.TAIL:
                context.globalAlpha = 0.2;
                context.fillStyle = background;
                context.fillRect(0, 0, width, height);
                break;
            case DrawType.CLEAR:
                context.globalAlpha = 1;
                context.fillStyle = background;
                context.fillRect(0, 0, width, height);
                break;
        }

        currentColour = colourSet.colours[currentColourIndex];
        if(iteration % 64 === 0)
            currentColourIndex = (currentColourIndex + 1) %
                colourSet.colours.length;
        const kdTree = new KdTree(nodes);

        for(let i = 0; i < params.feedRate; i++) {
            nodes.push(new Node(
                Math.random() * (width + 100) - 50,
                Math.random() * (height + 100) - 50,
                200,
                Math.random() * 0.06 + 0.06
            ));
        }

        const deadNodes = [];

        for(let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            node.decrementLifeTime();
            if(node.lifeTime === 0 || Math.random() < params.killRate) {
                deadNodes.push(i);
            }
            const nearest = kdTree.findKnnInRadius(params.connections,
                params.reach, node);
            for(const n of nearest) {
                n.point.pullTo(node, params.force, params.attract);
                node.point.pushFrom(n, node.force / 2, params.repel);
                for(const attractor of attractors) {
                    node.point.pullTo(attractor, params.force, width / 8);
                }
            }
        }

        for(const deadNode of deadNodes) {
            nodes.splice(deadNode, 1);
        }

        context.globalAlpha = 0.5;
        context.lineWidth = params.lineWidth;
        context.lineCap = 'round';
        for(let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            const nearest = kdTree.findKnnInRadius(params.connections,
                params.reach, node);
            for(const n of nearest) {
                const d = node.distanceTo(n);
                const index = ~~map(d, 0, params.reach, 0, selectedColours.length, 1, Ease.EASE_IN);
                context.strokeStyle = selectedColours[index];
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(n.x, n.y);
                context.stroke();
            }
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

    function switchDrawType() {
        switch(params.drawType) {
            case DrawType.KEEP:
                params.drawType = DrawType.CLEAR;
                break;
            case DrawType.CLEAR:
                params.drawType = DrawType.TAIL;
                break;
            case DrawType.TAIL:
                params.drawType = DrawType.KEEP;
                break;
        }
    }

    function showText(str) {
        let textEl = document.getElementById('text');
        if(!textEl) {
            textEl = document.createElement('div');
            textEl.id = 'text';
            textEl.style.position = 'absolute';
            textEl.style.zIndex = 10;
            textEl.style.left = '10px';
            textEl.style.top = '10px';
            textEl.style.fontSize = '32px';
            textEl.style.color = '#fff';
            textEl.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.6)';
            document.body.append(textEl);
        }
        textEl.innerText = str;
        if(textTimeout) clearTimeout(textTimeout);
        textTimeout = setTimeout(() => {
            textEl.innerText = '';
            textTimeout = null;
        }, 400);
    }

    function shuffle(arr) {
        for(let i = arr.length - 1; i > 0; i--) {
            const j = ~~(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
})();
