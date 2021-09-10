class Ellipse {
    static getCirclePoint(x, y, r, t) {
        return new Point(x + r * Math.cos(t), y + r * Math.sin(t));
    }

    static getEllipsePoint(x, y, a, b, t) {
        return new Point(x + a * Math.cos(t), y + b * Math.sin(t));
    }
}
