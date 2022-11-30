const canvas = document.getElementById('canvas');
let width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;
const context = canvas.getContext('2d');
let mesh = [];
const colours = ['#e2e6e7', '#b70015'];
let colourIndex = 0,
    angle = 0.75;
const length = 30,
    spacer = 10,
    modifier = -0.2;
let pointCount = width / length,
    lineCount = height / spacer,
    throttled = false,
    timeout = null;

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
    initialise(Arm);
    render();
};

var Arm = {
    x: 0,
    y: 0,
    length: 100,
    angle: 0,
    parent: null,

    create: function(x, y, length, angle) {
        const obj = Object.create(this);
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
        let angle = this.angle,
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

function initialise(Arm) {
    for(let i = 0; i < lineCount; i++) {
        const arms = [];
        arms.push(Arm.create(0, i * spacer, length, angle));
        for(let j = 1; j < pointCount; j++) {
            arms.push(
                Arm.create(arms[j - 1].getEndX(), arms[j - 1].getEndY(), length, 3));
            arms[j].parent = arms[j - 1];
        }
        mesh.push(arms);
    }
}

function render() {
    colourIndex = 0;
    context.clearRect(0, 0, width, height);
    for(let i = 0; i < lineCount; i++) {
        colourIndex = (colourIndex + 1) % colours.length;
        context.strokeStyle = colours[colourIndex];
        context.lineCap = "round";
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(this.x, this.y);
        for(let j = 0; j < pointCount; j++) {
            mesh[i][j].angle = Math.cos(angle) * modifier;
            if(j > 0) {
                mesh[i][j].x = mesh[i][j - 1].getEndX();
                mesh[i][j].y = mesh[i][j - 1].getEndY();
            }
            if(j === 0) context.moveTo(mesh[i][j].x, mesh[i][j].y);
            mesh[i][j].render(context);
        }
        context.stroke();
    }
    angle += 0.0075;

    requestAnimationFrame(render);
}

function resizeHandler() {
    mesh = [];
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    pointCount = width / length;
    lineCount = height / spacer;
    initialise(Arm);
}
