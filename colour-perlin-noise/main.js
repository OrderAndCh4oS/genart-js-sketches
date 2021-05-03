var canvas = document.getElementById('canvas'),
    throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    hsl = new RgbToHsl(),
    z = 0
;

noise.seed(Math.random());

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
    render();
};

function resizeHandler() {
    initialise();
    render();
}

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    hsl.fromRgbHex(0x33ffaa);
}

function render() {
    context.clearRect(0, 0, width, height);
    context.strokeStyle = '#fff';
    var max = Math.max(width, height);
    var scale = Math.abs(max / 125);
    for(var x = 0; x < width; x += scale + 1) {
        for(var y = 0; y < height; y += scale + 1) {
            hsl.h = getValue(x, y) * 359 % 359;
            context.fillStyle = `#${hsl.rgb.toString(16)}`;
            context.fillRect(x, y, scale, scale);
        }
    }
    z += 0.004;
    requestAnimationFrame(render);
}

function getValue(x, y) {
    var scale = 0.004;
    return noise.perlin3(x * scale, y * scale, z) * Math.PI * 2;
}
