const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let throttled = false,
    timeout = null,
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    ships = [],
    deadShips = [],
    isDarkMode = true
;

window.onclick = function() {
    isDarkMode = !isDarkMode;
}

window.onkeyup = function(e){
    if(e.code === 'Space'){
        initialise();
    }
}

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
    ships = [];
    deadShips = [];
    for(let i = 0; i < 6 * 10; i++) {
        const ship = player.create(Math.random() * (width), Math.random() *
            (height), (Math.random() * 0.2) + 0.1, (Math.random() * 0.5) + 0.5);
        ship.friction = 0.99;
        switch(i % 6) {
            case 0:
                ship.darkColour = '#6FC2E3';
                ship.colour = '#00AAB5';
                break;
            case 1:
                ship.darkColour = '#98C257';
                ship.colour = '#A8BF12';
                break;
            case 2:
                ship.darkColour = '#FAE16A';
                ship.colour = '#FBD506';
                break;
            case 3:
                ship.darkColour = '#FFC16B';
                ship.colour = '#FF9F00';
                break;
            case 4:
                ship.darkColour = '#F54780';
                ship.colour = '#F41C54';
                break;
            case 5:
                ship.darkColour = '#eaefef';
                ship.colour = '#46545b';
                break;
        }
        ship.id = i;
        ship.angle = i % 2 === 0 ? 0 : Math.PI;
        ships.push(ship);
    }
}

function update() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = isDarkMode ? '#252934' : '#edf1f1';
    context.fillRect(0, 0, width, height);
    for(let i = ships.length - 1; i >= 0; i--) {
        const ship = ships[i],
            hit = false;
        let angleToNearest = 0,
            nearest = false;

        for(let j = ships.length - 1; j >= 0; j--) {
            if(ships[j].colour !== ship.colour) {
                const distance = ship.distanceTo(ships[j]);
                if(!nearest && i !== j) {
                    angleToNearest = ships[j].angleToPredictedLocation(ship);
                    nearest = distance;
                }
                if(distance < nearest && i !== j) {
                    angleToNearest = ships[j].angleToPredictedLocation(ship);
                    nearest = distance;
                }
                if(distance < 12 && i !== j && !isInArray(i, deadShips) &&
                    !isInArray(j, deadShips.map(d => d.index))) {
                    if(Math.random >= 0.5) {
                        deadShips.push({index: j, deadShip: ships[j]});
                        ships[i].kills++;
                    } else {
                        deadShips.push({index: i, deadShip: ships[i]});
                        ships[j].kills++;
                    }
                }
            }
        }

        switch(true) {
            case (howClose(ship.angle, angleToNearest) >= 0.6):
                ship.turnLeft(ship.turningSpeed * 0.1);
                break;
            case (howClose(ship.angle, angleToNearest) >= 0.4):
                ship.turnLeft(ship.turningSpeed * 0.1 / 3 * 2);
                break;
            case (howClose(ship.angle, angleToNearest) >= 0.2):
                ship.turnLeft(ship.turningSpeed * 0.1 / 3);
                break;
            case (howClose(ship.angle, angleToNearest) > 0):
                ship.turnLeft(howClose(ship.angle, angleToNearest));
                break;
            case (howClose(ship.angle, angleToNearest) <= -0.6):
                ship.turnRight(ship.turningSpeed * 0.1);
                break;
            case (howClose(ship.angle, angleToNearest) <= -0.4):
                ship.turnRight(ship.turningSpeed * 0.1 / 3 * 2);
                break;
            case (howClose(ship.angle, angleToNearest) <= -0.2):
                ship.turnRight(ship.turningSpeed * 0.1 / 3);
                break;
            case (howClose(ship.angle, angleToNearest) < 0):
                ship.turnRight(howClose(ship.angle, angleToNearest));
                break;
            default:
                ship.stopTurning();
        }

        if(howClose(ship.angle, angleToNearest) <= 0.3 &&
            howClose(ship.angle, angleToNearest) >= -0.3) {
            ship.startThrusting(0.5);
        } else if(howClose(ship.angle, angleToNearest) <= 0.15 &&
            howClose(ship.angle, angleToNearest) >= -0.15) {
            ship.startThrusting(0.8);
        } else if(howClose(ship.angle, angleToNearest) <= 0.1 &&
            howClose(ship.angle, angleToNearest) >= -0.1) {
            ship.startThrusting(1);
        } else {
            ship.stopThrusting();
        }

        if(!hit) {
            ship.update();
            context.save();
            ship.draw(context, isDarkMode);
            context.restore();
            if(ship.position.getX() > width) {
                ship.position.setX(0);
            }
            if(ship.position.getX() < 0) {
                ship.position.setX(width);
            }
            if(ship.position.getY() > height) {
                ship.position.setY(0);
            }
            if(ship.position.getY() < 0) {
                ship.position.setY(height);
            }
        }
    }
    deadShips.sort((a, b) => a.index - b.index);
    for(let k = deadShips.length - 1; k >= 0; k--) {
        let {index, deadShip} = deadShips[k];
        context.save();
        context.translate(deadShip.position.getX(), deadShip.position.getY());
        context.beginPath();
        context.arc(0, 0, 20, 0, 2 * Math.PI);
        context.fillStyle = isDarkMode ? '#f89e00' : '#e50b0b';
        context.fill();
        context.restore();
        ships.splice(index, 1);
        deadShips.pop();
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function howClose(x, y) {
    return Math.atan2(Math.sin(x - y), Math.cos(x - y));
}
