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
    _otherNodes = [];

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

    set otherNodes(nodes) {
        this._otherNodes = nodes;
    }

    get nodes() {
        return this._graph.nodes;
    }

    update() {
        const kdTree = new KdTree([...this._graph.nodes, ...this._otherNodes]);
        let root = this._graph.root;
        while(root) {
            const kNearest = kdTree.findKnnInRadius(this._knn, this._knnRadius, root);
            if(root.leftEdge?.b) root.point.pullTo(root.leftEdge.b, this._leftPull, 15);
            if(root.rightEdge?.b) root.point.pullTo(root.rightEdge.b, this._rightPull, 15);
            for(const node of kNearest) {
                node.point.pushFrom(root.point, this._nearestPush, 45);
            }
            root = root.rightEdge?.b;
        }
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
        const region = new Path2D();
        region.moveTo(this._graph.points[0].x, this._graph.points[0].y);
        while(root) {
            const point = root.point;
            region.lineTo(point.x, point.y);
            root = root.rightEdge?.b;
        }
        context.stroke(region);
    }

    drawDots(context, fillColour, radius) {
        context.fillStyle = fillColour;
        let root = this._graph.root;
        while(root) {
            const point = root.point;
            context.beginPath();
            context.arc(point.x, point.y, radius, 0, TAU, true);
            context.fill();
            root = root.rightEdge?.b;
        }
    }
}

class LineGrowthPattern extends GrowthPatternAbstract {
    init(x1, y1, x2, y2, n) {
        this._graph = new Graph();
        const line = new Line(new Point(x1, y1), new Point(x2, y2));
        for(let a = 0; a <= n; a++) {
            const point = line.getPointAt(a / n);
            this._graph.addNode(
                new Vector(point.x + Math.random() - 0.5, point.y + Math.random() - 0.5));
        }

        this._graph.makeEdges();
    }
}
