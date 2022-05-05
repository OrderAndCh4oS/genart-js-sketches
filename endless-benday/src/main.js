import {colours} from './colours.js';
import {makeRandomFromSeed} from './endless-random.js';

const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    rand = makeRandomFromSeed(),
    TAU = Math.PI * 2
;

let x,
    y,
    endX,
    endY,
    width,
    height,
    margin
;

const colourSet = colours[rand.randomInt(0, colours.length)];
const allColours = shuffle([...colourSet.colours, colourSet.white, colourSet.black]);

function initialise() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    diagonalLength = Math.sqrt(width * width + height * height);
    margin = diagonalLength * 0.25;
    context.fillStyle = allColours[0];
    context.fillRect(0, 0, width, height);
    context.fillStyle = allColours[1];
}

function draw() {
    initialise();
    drawBenDayDots(
        0,
        0,
        width,
        height,
        6,
        rand.randomFloat(0.15, 0.45),
        context
    );
    for(let i = 0; i < 666; i++) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(
            (rand.random() * (width - margin)) + (margin / 2),
            (rand.random() * (height - margin)) + (margin / 2)
        );
        for(let j = 0; j < 5; j++) {
            context.fillStyle = allColours[
                ~~(rand.random() * allColours.length)
                ];
            context.rotate(rand.randomFloat(0, TAU));
            x = diagonalLength * rand.randomFloat(0.018, 0.066);
            y = diagonalLength * rand.randomFloat(0.018, 0.066);
            endX = x * 2;
            endY = y * 2;
            drawBenDayDots(-x,
                -y,
                endX,
                endY,
                3,
                rand.randomFloat(0.05, 0.5),
                context
            );
        }
    }
}

function drawBenDayDots(startX, startY, w, h, diameter, scale, context) {
    let rowIndex = 0;
    const xEnd = startX + w + diameter;
    for(let x = startX - diameter; x < xEnd; x += diameter) {
        const yEnd = startY + h + diameter + (diameter / 2);
        for(let y = startY + (rowIndex % 2 === 0 ? 0 : -(diameter / 2)); y <
        yEnd; y += diameter) {
            context.beginPath();
            context.ellipse(x, y, diameter * scale, diameter * scale, 0, 0,
                TAU);
            context.fill();
        }
        rowIndex++;
    }
}

function shuffle(arr) {
    let randomizedArray = [];
    let array = arr;
    while(array.length !== 0) {
        let rIndex = Math.floor(array.length * Math.random());
        randomizedArray.push(array[rIndex]);
        array.splice(rIndex, 1);
    }
    return randomizedArray;
}

draw();
