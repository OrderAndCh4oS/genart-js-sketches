function drawBenDayDots(startX, startY, w, h, diameter, scale, context) {
    let rowIndex = 0;
    const xEnd = startX + w + diameter;
    for (x = startX - diameter; x < xEnd; x += diameter) {
        const yEnd = startY + h + diameter + (diameter / 2);
        for (y = startY + (rowIndex % 2 === 0 ? 0 : -(diameter / 2)); y < yEnd; y += diameter) {
            context.beginPath();
            context.ellipse(x, y, diameter * scale, diameter * scale, 0, 0, 2 * Math.PI);
            context.fill();
        }
        rowIndex++;
    }
}
