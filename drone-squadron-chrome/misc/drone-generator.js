import { weapons } from '../constants/weapons.js';
import { gimbals, scanners, steering, thrusters } from '../constants/utilities.js';
import nameGenerator from './name-generator.js';

const droneGenerator = () => {
    const weaponKeys = Object.keys(weapons);
    const scannerKeys = Object.keys(scanners);
    const thrusterKeys = Object.keys(thrusters);
    const steeringKeys = Object.keys(steering);
    const gimbalKeys = Object.keys(gimbals);
    return ({
        name: nameGenerator(),
        weapon: weaponKeys[~~(Math.random() * weaponKeys.length)],
        gimbal: gimbalKeys[~~(Math.random() * gimbalKeys.length)],
        scanner: scannerKeys[~~(Math.random() * 5)],
        steering: steeringKeys[~~(Math.random() * steeringKeys.length)],
        thruster: thrusterKeys[~~(Math.random() * thrusterKeys.length)],
    });
}

export default droneGenerator;
