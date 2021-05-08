import Gimbal from '../gimbal.js';

export default class G60 extends Gimbal {
    constructor() {
        super(0.175 * 3, 0.12);
    }
}
