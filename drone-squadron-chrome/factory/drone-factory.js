import Drone from '../game-object/drone.js';
import { canvas, dm } from '../constants/constants.js';

export default class DroneFactory {
    static make(droneData, squadronData) {
        const drone = new Drone(
            droneData,
            squadronData,
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * Math.PI * 2,
        );
        dm.addDrone(drone);
        return drone;
    }
}
