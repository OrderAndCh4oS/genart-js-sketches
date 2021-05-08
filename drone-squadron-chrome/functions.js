import { canvas } from './constants/constants.js';

export function isOffCanvas(particle) {
    return (
        particle.position.x > (canvas.width + particle.radius) ||
        particle.position.x < (0 - particle.radius) ||
        particle.position.y > (canvas.height + particle.radius) ||
        particle.position.y < (0 - particle.radius)
    );
}

export function returnToCanvas(drone) {
    if(drone.position.x > canvas.width) {
        drone.position.x = 0;
    }
    if(drone.position.x < 0) {
        drone.position.x = canvas.width;
    }
    if(drone.position.y > canvas.height) {
        drone.position.y = 0;
    }
    if(drone.position.y < 0) {
        drone.position.y = canvas.height;
    }
}

export function distanceTo(p1, p2) {
    const dx = p2.position.x - p1.position.x,
        dy = p2.position.y - p1.position.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function angleTo(angleOne, angleTwo) {
    return Math.atan2(Math.sin(angleOne - angleTwo),
        Math.cos(angleOne - angleTwo));
}

export function didCollide(p1, p2) {
    return !(p1.squadId === p2.squadId) && distanceTo(p1, p2) < p1.radius +
        p2.radius;
}

export function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

export function angleBetweenRange(angleOne, angleTwo, range) {
    return angleTo(angleOne, angleTwo) <= range / 2 &&
        angleTo(angleOne, angleTwo) >= -(range / 2);
}

export function shuffle(arr) {
    let randomizedArray = [];
    let array = arr;
    while(array.length !== 0) {
        let rIndex = Math.floor(array.length * Math.random());
        randomizedArray.push(array[rIndex]);
        array.splice(rIndex, 1);
    }
    return randomizedArray;
}
