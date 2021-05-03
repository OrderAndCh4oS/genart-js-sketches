import T20 from '../utility/thruster/T20.js';
import T18 from '../utility/thruster/T18.js';
import T15 from '../utility/thruster/T15.js';
import T12 from '../utility/thruster/T12.js';
import T10 from '../utility/thruster/T10.js';
import S15 from '../utility/steering/S15.js';
import S12 from '../utility/steering/S12.js';
import S10 from '../utility/steering/S10.js';
import S8 from '../utility/steering/S8.js';
import S6 from '../utility/steering/S6.js';
import S4 from '../utility/steering/S4.js';
import G360 from '../utility/gimbal/G360.js';
import G240 from '../utility/gimbal/G240.js';
import G180 from '../utility/gimbal/G180.js';
import G120 from '../utility/gimbal/G120.js';
import G90 from '../utility/gimbal/G90.js';
import G60 from '../utility/gimbal/G60.js';
import G40 from '../utility/gimbal/G40.js';
import SC900 from '../utility/scanner/SC900.js';
import SC800 from '../utility/scanner/SC800.js';
import SC700 from '../utility/scanner/SC700.js';
import SC600 from '../utility/scanner/SC600.js';
import SC500 from '../utility/scanner/SC500.js';
import SC400 from '../utility/scanner/SC400.js';
import SC300 from '../utility/scanner/SC300.js';
import SC200 from '../utility/scanner/SC200.js';

export const gimbals = {
    'G40': G40,
    'G60': G60,
    'G90': G90,
    'G120': G120,
    'G180': G180,
    'G240': G240,
    'G360': G360,
};

export const scanners = {
    'SC200': SC200,
    'SC300': SC300,
    'SC400': SC400,
    'SC500': SC500,
    'SC600': SC600,
    'SC700': SC700,
    'SC800': SC800,
    'SC900': SC900,
};

export const steering = {
    'S4': S4,
    'S6': S6,
    'S8': S8,
    'S10': S10,
    'S12': S12,
    'S15': S15,
};

export const thrusters = {
    'T10': T10,
    'T12': T12,
    'T15': T15,
    'T18': T18,
    'T20': T20,
};
