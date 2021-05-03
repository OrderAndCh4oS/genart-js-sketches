var creator = new URLSearchParams(window.location.search).get('creator')
var viewer = new URLSearchParams(window.location.search).get('viewer')

console.log('NFT created by', creator)
console.log('NFT viewed by', viewer)

var canvas = document.getElementById('canvas'),
    throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext('2d');

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

}

function render() {
    colourIndex = 0;
    context.clearRect(0, 0, width, height);

    requestAnimationFrame(render);
}

function resizeHandler() {
    initialise();
}
