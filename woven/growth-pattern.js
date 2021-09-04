class GrowthPatternAbstract {
    _graph;
    _nearestPush;
    _leftPull;
    _rightPull;
    _knn;
    _knnRadius;
    _maxLength;
    _maxNodes;
    _randomInsert;

    constructor(
        nearestPush,
        leftPull,
        rightPull,
        knn,
        knnRadius,
        maxLength,
        maxNodes,
        randomInsert,
    ) {
        this._nearestPush = nearestPush;
        this._leftPull = leftPull;
        this._rightPull = rightPull;
        this._knn = knn;
        this._knnRadius = knnRadius;
        this._maxLength = maxLength;
        this._maxNodes = maxNodes;
        this._randomInsert = randomInsert;
    }

    update(centre) {
        const kdTree = new KdTree(this._graph.nodes);
        let root = this._graph.root;
        const start = this._graph.root;
        do {
            const kNearest = kdTree.findKnnInRadius(this._knn, this._knnRadius, root);
            root.point.pullTo(root.leftEdge.b, this._leftPull, 25);
            root.point.pullTo(root.rightEdge.b, this._rightPull, 25);
            for(const node of kNearest) {
                node.point.pushFrom(root.point, this._nearestPush, 55);
            }
            root.point.moveAwayFrom(centre, 0.75)
            // root.point.addTo(new Vector(1, 0));
            root = root.rightEdge?.b;
        } while(root !== start);
        if(this._graph.nodes.length < this._maxNodes) {
            if(Math.random() < this._randomInsert) {
                const edge = this._graph.edges[~~(Math.random() * this._graph.edges.length)];
                this._graph.splitEdge(edge);
            }
            for(const edge of this._graph.edges) {
                if(edge.a.distanceTo(edge.b) > this._maxLength) {
                    this._graph.splitEdge(edge);
                }
            }
        }
    }

    drawConnections(context, strokeColour, lineWidth = 1, lineJoin = 'bevel') {
        context.strokeStyle = strokeColour;
        context.lineWidth = lineWidth;
        context.lineJoin = lineJoin;

        let root = this._graph.root;
        const start = this._graph.root;
        const region = new Path2D();
        region.moveTo(this._graph.points[0].x, this._graph.points[0].y);
        do {
            const point = root.point;
            region.lineTo(point.x, point.y);
            root = root.rightEdge?.b;
        } while(root !== start);
        region.closePath();
        context.stroke(region);
    }

    drawDots(context, fillColour, radius) {
        context.fillStyle = fillColour;

        let root = this._graph.root;
        const start = this._graph.root;
        do {
            const point = root.point;
            context.beginPath();
            context.arc(point.x, point.y, radius, 0, TAU, true);
            context.fill();
            root = root.rightEdge?.b;
        } while(root !== start);
    }
}

class EllipseGrowthPattern extends GrowthPatternAbstract {
    init(centre, radius, count) {
        this._graph = new Graph();
        for(let a = 0; a < TAU; a += TAU / count) {
            const point = Ellipse.getCirclePoint(centre.x + Math.random() * 6 - 3,
                centre.y + Math.random() * 6 - 3, radius, a);
            this._graph.addNode(new Vector(point.x, point.y));
        }
        this._graph.makeEdges();
    }
}

class RectGrowthPattern extends GrowthPatternAbstract {
    init(x, y, w, sections) {
        this._graph = new Graph();
        const points = Rect.getSquarePoints(x, y, w, sections);
        for(const point of points) {
            this._graph.addNode(new Vector(point.x, point.y));
        }

        this._graph.makeEdges();
    }
}
