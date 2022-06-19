const Ease = Object.freeze({
    EASE_IN: 0,
    EASE_OUT: 1,
    EASE_IN_OUT: 2
});

/*
 * A map() replacement that allows for specifying easing curves
 * with arbitrary exponents.
 *
 * value :   The value to map
 * aStart:   The lower limit of the input range
 * aStop :   The upper limit of the input range
 * bStart:   The lower limit of the output range
 * bStop :   The upper limit of the output range
 * exponent :   The exponent value (e.g., 0.5, 0.1, 0.3)
 * ease  :   One of EASE_IN, EASE_OUT, or EASE_IN_OUT
 */
function map(value, aStart, aStop, bStart, bStop, exponent, ease) {
    const b = bStart;
    const c = bStop - bStart;
    let t = value - aStart;
    const d = aStop - aStart;
    const p = exponent;
    let out = 0;
    if(ease === Ease.EASE_IN) {
        t /= d;
        out = c * Math.pow(t, p) + b;
    } else if(ease === Ease.EASE_OUT) {
        t /= d;
        out = c * (1 - Math.pow(1 - t, p)) + b;
    } else if(ease === Ease.EASE_IN_OUT) {
        t /= d / 2;
        if(t < 1) return c / 2 * Math.pow(t, p) + b;
        out = c / 2 * (2 - Math.pow(2 - t, p)) + b;
    }
    return out;
}
