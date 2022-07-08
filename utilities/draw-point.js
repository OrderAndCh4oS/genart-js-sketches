function drawPoint(p, r = 1) {
    context.beginPath();
    context.arc(
        p.x,
        p.y,
        r,
        0,
        TAU,
        true
    );
    context.fill();
}
