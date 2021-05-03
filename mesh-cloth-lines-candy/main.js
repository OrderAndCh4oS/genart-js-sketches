var canvas = document.getElementById('canvas'),
    throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d'),
    mesh = [],
    angle,
    length,
    spacer,
    modifier,
    pointCount,
    lineCount,
    kinks = [],
    kink,
    jilt,
    colourIndex,
    colours = ['#5CCCC7', '#F2DC6B', '#FF8F8E', '#BB7FFF', '#A0FF74'],
    startColourIndex = ~~(Math.random() * colours.length)
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

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    mesh = [];
    kinks = [];
    angle = 97;
    length = width / 26;
    spacer = 8;
    modifier = -0.115;
    pointCount = (width * 1.75) / length;
    lineCount = (height + 160) / spacer;
    kink = 50;
    jilt = 10;
    for(var i = 0; i < lineCount; i++) {
        var arms = [];
        arms.push(Arm.create(-75, i * spacer - 50, length, angle));
        for(var j = 1; j < pointCount; j++) {
            arms.push(
                Arm.create(
                    arms[j - 1].getEndX(),
                    arms[j - 1].getEndY(),
                    length,
                    3,
                ));
            arms[j].parent = arms[j - 1];
            arms[j].jilt = Math.cos(jilt += Math.random() * 0.0024);
        }
        mesh.push(arms);
    }
    for(var k = 0; k < pointCount; k++) {
        kinks.push(15 + Math.random() * kink);
    }
}

function update() {
    colourIndex = startColourIndex;
    for(var i = 0; i < lineCount; i++) {
        colourIndex = (colourIndex + 1) % colours.length;
        context.strokeStyle = colours[colourIndex];
        context.lineCap = "round";
        context.lineJoin = "round";
        context.beginPath();
        for(var j = 0; j < pointCount; j++) {
            mesh[i][j].angle = Math.sin(angle + kinks[j] - kink / 2 +
                mesh[i][j].jilt) * modifier;
            if(j > 0) {
                mesh[i][j].x = mesh[i][j - 1].getEndX();
                mesh[i][j].y = mesh[i][j - 1].getEndY();
            }
            if(j === 0) context.moveTo(mesh[i][j].x, mesh[i][j].y);
            mesh[i][j].render(context);
        }
        context.stroke();
    }

    angle += 0.005;
}

function render() {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 80;
    update();
    requestAnimationFrame(render);
}

function resizeHandler() {
    initialise();
}

var Arm = {
    x: -75,
    y: -16,
    length: 100,
    angle: 0,
    parent: null,
    jilt: 0,

    create: function(x, y, length, angle) {
        var obj = Object.create(this);
        obj.init(x, y, length, angle);
        return obj;
    },

    init: function(x, y, length, angle) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = angle;
    },

    parentAngles: function() {
        var angle = this.angle,
            parent = this.parent;
        while(parent) {
            angle += parent.angle;
            parent = parent.parent;
        }
        return angle;
    },

    getEndX: function() {
        return this.x + Math.cos(this.parentAngles()) * this.length;
    },

    getEndY: function() {
        return this.y + Math.sin(this.parentAngles()) * this.length;
    },

    render: function(context) {
        context.lineTo(this.getEndX(), this.getEndY());
    },
};
