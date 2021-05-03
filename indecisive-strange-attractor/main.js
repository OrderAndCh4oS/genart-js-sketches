var canvas = document.getElementById('canvas'),
    throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    points = [],
    aD = 1,
    bD = 0,
    cD = 1,
    dD = 0,
    a,
    b,
    c,
    d,
    hsl = new RgbToHsl(),
    m
;

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

function render() {
    update();
    requestAnimationFrame(render);
}

function resizeHandler() {
    initialise();
}

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    aD = 1;
    bD = 0;
    cD = 1;
    dD = 0;
    a = Math.random() * 6;
    b = Math.random() * 6;
    c = Math.random() * 6;
    d = Math.random() * 6;
    points = [];
    for(var i = 0; i < 10000; i += 1) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
        });
    }
    hsl.fromRgbValues(255, 0, 0);
}

function update() {
    context.clearRect(0, 0, width, height);

    m = Math.random() * 0.02 + 0.01;
    if(a < 0.01) aD = 1;
    else if(a > 5.99) aD = 0;
    if(aD === 0) m = -m;
    a = (a + m);

    m = Math.random() * 0.02 + 0.01;
    if(b < 0.01) bD = 1;
    else if(b > 5.99) bD = 0;
    if(bD === 0) m = -m;
    b = (b + m);

    m = Math.random() * 0.02 + 0.01;
    if(c < 0.01) cD = 1;
    else if(c > 5.99) cD = 0;
    if(cD === 0) m = -m;
    c = (c + m);

    m = Math.random() * 0.02 + 0.01;
    if(d < 0.01) dD = 1;
    else if(d > 5.99) dD = 0;
    if(dD === 0) m = -m;
    d = (d + m);

    for(var i = 0; i < points.length; i++) {
        var value = getValue(points[i].x, points[i].y);
        points[i].vx += Math.cos(value) * 0.3;
        points[i].vy += Math.sin(value) * 0.3;
        hsl.l = (100 * value);
        context.lineWidth = 2;
        context.strokeStyle = `#${hsl.rgb.toString(16)}`;
        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        points[i].x += points[i].vx;
        points[i].y += points[i].vy;
        context.lineTo(points[i].x, points[i].y);
        context.stroke();
        points[i].vx *= 0.99;
        points[i].vy *= 0.99;
        if(points[i].x > width) points[i].x = 0;
        else if(points[i].x < 0) points[i].x = width;
        if(points[i].y > height) points[i].y = 0;
        else if(points[i].y < 0) points[i].y = height;
    }
}

function getValue(x, y) {
    x = (x - width / 2) * 0.004;
    y = (y - height / 2) * 0.004;

    var x1 = Math.sin((a - 3) * y) + (c - 3) * Math.cos((a - 3) * x);
    var y1 = Math.sin((b - 3) * x) + (d - 3) * Math.cos((b - 3) * y);

    return Math.atan2(y1 - y, x1 - x);
}
