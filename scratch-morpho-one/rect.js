class Rect {
    static getSquarePoints(x, y, w, sections) {
        const xStart = x;
        const yStart = y;
        const xEnd = x + w;
        const yEnd = y + w;
        const xStep = x / sections;
        const yStep = y / sections;
        const points = [];
        for(; x <= xEnd; x += xStep) {
            points.push(new Point(x, y));
        }
        for(; y <= yEnd; y += y / yStep) {
            points.push(new Point(x, y));
        }
        for(; x >= xStart; x -= xStep) {
            points.push(new Point(x, y));
        }
        for(; y >= yStart; y -= yStep) {
            points.push(new Point(x, y));
        }

        return points;
    }

    static getRectPoints(x, y, w, h, xSections, ySections) {
        const xStart = x;
        const yStart = y;
        const xEnd = x + w;
        const yEnd = y + h;
        const xStep = x / xSections;
        const yStep = y / ySections;
        const points = [];
        for(; x <= xEnd; x += xStep) {
            points.push(new Point(x, y));
        }
        for(; y <= yEnd; y += y / yStep) {
            points.push(new Point(x, y));
        }
        for(; x >= xStart; x -= xStep) {
            points.push(new Point(x, y));
        }
        for(; y >= yStart; y -= yStep) {
            points.push(new Point(x, y));
        }

        return points;
    }
}
