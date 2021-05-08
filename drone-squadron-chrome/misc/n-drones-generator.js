import droneGenerator from './drone-generator.js';

const nDronesGenerator = (n) => new Array(n).fill().map(_ => droneGenerator());

export default nDronesGenerator;
