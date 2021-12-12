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
        fps = 24,
        startTime,
        play = true,
        lines = [],
        endLines = [],
        complete = false,
        startX,
        startY
    ;

    const colours = [
        {
            name: 'Black & White',
            black: '#0D0D0D',
            white: '#F2F2F2',
            stems: ['#8C8C8C'],
            foliage: ['#262626', '#595959']
        },
        {
            name: 'Pink Blossom',
            black: '#0D0D0D',
            white: '#EDF6F7',
            stems: ['#8a9fa2'],
            foliage: ['#D97981', '#F2BDBD']
        },
        {
            name: 'Apple',
            black: '#0E2622',
            white: '#F2F2F2',
            stems: ['#58788C'],
            foliage: ['#05F258', '#D95F5F']
        },
        {
            name: 'Rubine',
            black: '#232526',
            white: '#d5e8f2',
            stems: ['#767c7e'],
            foliage: ['#bc1cf1', '#e0107f']
        },
        {
            name: 'Warm Grey',
            black: '#0B2126',
            white: '#f5f1ec',
            stems: ['#BEBFB8', '#989993'],
            foliage: ['#72736E', '#F2D8A7', '#D9B391']
        },
        {
            name: 'Dusty Red',
            black: '#080D0B',
            white: '#faf6eb',
            stems: ['#a2a198', '#d5d2c2'],
            foliage: ['#830909', '#12384f', '#354957']
        },
        {
            name: 'French Grey',
            black: '#0E1012',
            white: '#fafaf7',
            stems: ['#b3b8be', '#d0d7dc'],
            foliage: ['#1A2D3B', '#1C3F69', '#77B2D0']
        },
        {
            name: 'Mint',
            black: '#151716',
            white: '#d7d7d4',
            stems: ['#a3b7ad', '#5f6964'],
            foliage: ['#FFF4BB', '#569E91', '#D3FF81']
        },
        {
            name: 'Rouge',
            black: '#171521',
            white: '#fff6f0',
            stems: ['#5b5d55', '#a1a097'],
            foliage: ['#fa4162', '#c91053', '#7e0935']
        },
        {
            name: 'Furnace',
            black: '#172526',
            white: '#D5D9D2',
            stems: ['#455759', '#748C8C'],
            foliage: ['#D93E30', '#e16007', '#d31066']
        },
        {
            name: 'Harvest',
            black: '#0D1F30',
            white: '#F0E3C0',
            stems: ['#d9d1c7', '#a9a49c'],
            foliage: ['#3B6670', '#DB6C0F', '#8BADA3']
        },
        {
            name: 'Azure',
            black: '#1B1B1D',
            white: '#F1F2EB',
            stems: ['#E4E6DF', '#C1C2BC'],
            foliage: ['#1E3CE0', '#5E3CFA', '#3E98FA', '#9242D6']
        },
        {
            name: 'Mocha',
            black: '#170b10',
            white: '#F2ECE6',
            stems: ['#d4c8c3', '#a19b94'],
            foliage: ['#F2D5BB', '#A6634B', '#592C22', '#26070C']
        },
        {
            name: 'Forest',
            black: '#0D0D0D',
            white: '#F5F5F5',
            stems: ['#ADA695', '#CCC3AF'],
            foliage: ['#194035', '#94BF36', '#5AAB2E', '#F0F2BD']
        },
        {
            name: 'Twilight',
            black: '#141517',
            white: '#eeede9',
            stems: ['#C3D4D2', '#94A19D'],
            foliage: ['#05F2AF', '#175073', '#0C2E59', '#D9525E']
        },
        {
            name: 'Retro Grey',
            black: '#111112',
            white: '#FDFDFD',
            stems: ['#BDBDBF', '#8B8B8C'],
            foliage: ['#A4B6A0', '#DA4522', '#333335', '#575758']
        },
        {
            name: 'Sunset',
            black: '#0D0D0D',
            white: '#F7F4EB',
            stems: ['#ABCFCB', '#C3EBE7'],
            foliage: ['#F2637E', '#038C7F', '#D9AC25', '#F25430']
        },
        {
            name: 'Pastel',
            black: '#222226',
            white: '#F7F3EB',
            stems: ['#D6D3CB', '#C9C6BF'],
            foliage: ['#A4E5E6', '#F7DB9D', '#6D7099', '#FF8B94']
        },
        {
            name: 'Warm Dusk',
            black: '#11161A',
            white: '#E4F0F7',
            stems: ['#829DAD', '#A4C6DB'],
            foliage: ['#D96A9E', '#053959', '#032F40', '#177DA6', '#1FA2BF']
        },
        {
            name: 'Luscious Purple',
            black: '#0F0F12',
            white: '#DEE3E2',
            stems: ['#918E99', '#717177'],
            foliage: ['#C004D9', '#63038C', '#310859', '#0B0D40', '#03738C']
        },
        {
            name: 'Peach',
            black: '#13161A',
            white: '#f8f0e8',
            stems: ['#E8D5DC', '#AAA3B5'],
            foliage: ['#FFAA5C', '#DA727E', '#AC6C82', '#685C79', '#455C7B']
        },
        {
            name: 'Candy',
            black: '#1F1C1C',
            white: '#F8F2FA',
            stems: ['#C1B1C7', '#A1999C'],
            foliage: ['#F08571', '#C9F07D', '#F065A3', '#4DF0AE', '#CB59F0']
        }
    ];

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    startX = width / 2;
    startY = height / 2;
    const colourIndex = ~~map(fxrand(), 0, 1, 0, colours.length, 0.8,
        Ease.EASE_OUT);
    const colourSet = colours[colourIndex];
    const darkMode = fxrand() > 0.66;
    const blackAndWhite = fxrand() > 0.99;
    let background = darkMode
        ? colourSet.black
        : colourSet.white;
    background = blackAndWhite
        ? colourSet.foliage[~~(fxrand() * colourSet.foliage.length)]
        : background;
    document.body.style.backgroundColor = background;
    const stems = blackAndWhite ? [colourSet.black] : colourSet.stems;
    const foliage = blackAndWhite
        ? [colourSet.white]
        : colourSet.foliage;
    const lean = (0.2 + fxrand() * 0.7).toFixed(1);
    const coneAngle = (PI * 0.33 + fxrand() * 0.33).toFixed(2);
    const length = 60 + ~~(fxrand() * 10);
    const startLineWidth = 4 + ~~(fxrand() * 8);
    const inverted = fxrand() > 0.66 ? 1 : 0;
    const startLinesCount = 2 + ~~map(fxrand(), 0, 1, 0, 5, 0.9, Ease.EASE_OUT);
    const drawFunction = [drawShape, drawShapeTwo][inverted];

    window.$fxhashFeatures = {
        'Colour': colourSet.name,
        'Mode': blackAndWhite ? 'Black & White' : darkMode ? 'Night' : 'Day',
        'Foliage Colours': blackAndWhite ? 1 : colourSet.foliage.length,
        'Stems Shades': blackAndWhite ? 1 : colourSet.stems.length,
        'Roots': startLinesCount,
        'Root Length': length,
        'Stem Width': startLineWidth,
        'Spread': coneAngle,
        'Lean': lean,
        ...(inverted === 1 && {'Inverted Stems': true}),
    };
    window.onclick = function(event) {
        startX = event.clientX;
        startY = event.clientY;
        initialise();
        update();
    };

    window.onkeyup = function(e) {
        if(e.code === 'Space') {
            play = !play;
        }
    };

    window.onresize = function() {
        startX = width / 2;
        startY = height / 2;
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

    function getStartLine(length, startLineWidth) {
        const x = startX;
        const y = startY;
        const angle = fxrand() * TAU;
        const aX = x + Math.cos(angle) * length;
        const aY = y + Math.sin(angle) * length;
        const startLine = new Line(
            new Point(x, y),
            new Point(aX, aY)
        );
        startLine.width = startLineWidth;
        startLine.colour = stems[~~(fxrand() * stems.length)];
        return startLine;
    }

    function initStartLines() {
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        const startLines = [];
        for(let i = 0; i < startLinesCount; i++) {
            const startLine = getStartLine(length, startLineWidth);
            startLines.push(startLine);
        }
        lines = [...startLines];
        endLines = [...startLines];
        complete = false;
    }

    function initialise() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initStartLines();
    }

    function startAnimating() {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        render();
    }

    function drawShape(line) {
        context.fillStyle = line.colour;
        const angle = line.getAngle();
        const width = line.width / 2;
        const aX = line.a.x + Math.cos(angle + Math.PI * 0.5) * width;
        const aY = line.a.y + Math.sin(angle + Math.PI * 0.5) * width;
        const bX = line.a.x + Math.cos(angle + Math.PI * 1.5) * width;
        const bY = line.a.y + Math.sin(angle + Math.PI * 1.5) * width;
        context.beginPath();
        context.moveTo(line.b.x, line.b.y);
        context.lineTo(aX, aY);
        context.lineTo(bX, bY);
        context.lineTo(line.b.x, line.b.y);
        context.fill();
    }

    function drawShapeTwo(line) {
        context.fillStyle = line.colour;
        const angle = line.getAngle();
        const width = line.width / 2;
        const aX = line.b.x + Math.cos(angle + Math.PI * 0.5) * width;
        const aY = line.b.y + Math.sin(angle + Math.PI * 0.5) * width;
        const bX = line.b.x + Math.cos(angle + Math.PI * 1.5) * width;
        const bY = line.b.y + Math.sin(angle + Math.PI * 1.5) * width;
        context.beginPath();
        context.moveTo(line.a.x, line.a.y);
        context.lineTo(aX, aY);
        context.lineTo(bX, bY);
        context.lineTo(line.a.x, line.a.y);
        context.fill();
    }

    function completed() {
        complete = true;
    }

    function update() {
        if(complete) return;

        for(const line of endLines) {
            drawFunction(line);
        }

        if(!endLines.length) {
            completed();
            return;
        }
        const branchFrom = [...endLines];
        const newLines = [];

        for(let i = 0; i < branchFrom.length; i++) {
            let branch = branchFrom[i];
            const count = 3 + ~~(fxrand() * 3);
            for(let j = 0; j <= count; j++) {
                const v1 = new Vector(branch.a.x, branch.a.y);
                const v2 = new Vector(branch.b.x, branch.b.y);
                const v3 = new Vector(branch.b.x, branch.b.y);
                const angleFrom = v1.angleTo(v2);
                const angleMod = fxrand() * coneAngle - (coneAngle * lean);

                const v4 = new Vector(0, 0);
                const branchLength = (branch.length * 0.93);
                if(branchLength < 25) {
                    completed();
                    return;
                }
                v4.length = branchLength;
                v4.angle = angleFrom + angleMod;
                v2.addTo(v4);

                const v5 = new Vector(0, 0);
                v5.length = branch.length + 5;
                v5.angle = angleFrom + angleMod;
                v3.addTo(v5);

                const intersectLine = new Line(branch.b, new Point(v3.x, v3.y));

                const line = new Line(branch.b, new Point(v2.x, v2.y));
                let isIntersect = false;
                for(const otherLine of lines) {
                    if(otherLine === intersectLine) continue;
                    if(intersectLine.isIntersect(otherLine)) {
                        isIntersect = true;
                        break;
                    }
                }
                for(const otherLine of newLines) {
                    if(otherLine === intersectLine) continue;
                    if(intersectLine.isIntersect(otherLine)) {
                        isIntersect = true;
                        break;
                    }
                }
                if(!isIntersect &&
                    isInBounds(line.b, width - 20, height - 20)) {
                    line.width = branch.width * 0.95;
                    line.colour = line.length < 50
                        ? foliage[~~(fxrand() * foliage.length)]
                        : stems[~~(fxrand() * stems.length)];
                    newLines.push(line);
                }
            }
        }

        endLines = [...newLines];
        lines.push(...newLines);
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

    function isInBounds(p, w, h) {
        return !(p.x < 20 || p.y < 20 || p.x > w || p.y > h);
    }
})();

