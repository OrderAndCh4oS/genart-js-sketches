class GrowthPatternAbstract {
    _graph;
    _nearestPush;
    _leftPull;
    _rightPull;
    _knn;
    _maxLength;
    _maxNodes;
    _randomInsert;
    _otherNodes = [];

    constructor(
        nearestPush,
        leftPull,
        rightPull,
        knn,
        maxLength,
        maxNodes,
        randomInsert,
    ) {
        this._nearestPush = nearestPush;
        this._leftPull = leftPull;
        this._rightPull = rightPull;
        this._knn = knn;
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

    concatNodes(nodes) {
        this._otherNodes.concat(nodes);
    }

    resetNodes() {
        this._otherNodes = [];
    }

    update() {
        const kdTree = new KdTree(this._graph.nodes);
        let root = this._graph.root;
        while(root) {
            const kNearest = kdTree.findKnn(this._knn, root);
            if(root.leftEdge?.b) root.point.pullTo(root.leftEdge.b, this._leftPull, 15);
            if(root.rightEdge?.b) root.point.pullTo(root.rightEdge.b, this._rightPull, 15);
            for(const node of kNearest) {
                node.point.pushFrom(root.point, this._nearestPush, 45);
            }
            root = root.rightEdge?.b;
        }
        if(this._graph.nodes.length < this._maxNodes) {
            if(fxrand() < this._randomInsert) {
                const edge = this._graph.edges[~~(fxrand() * this._graph.edges.length)];
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
        const kdTree = new KdTree(this._graph.nodes);

        context.strokeStyle = strokeColour;
        context.lineWidth = lineWidth;
        context.lineJoin = lineJoin;

        let root = this._graph.root;

        while(root) {
            const point = root.point;
            const nearest = kdTree.findKnn(3, point);
            context.beginPath();
            context.moveTo(point.x, point.y);
            for(const n of nearest) {
                context.lineTo(n.point.x, n.point.y);
            }
            context.stroke();
            root = root.rightEdge?.b;
        }
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

class BezierLineGrowthPattern extends GrowthPatternAbstract {
    init(w, h, n) {
        this._graph = new Graph();
        const yOff = h / 4;
        const y1 = -(h / 8);
        const y2 = h + (h / 8);
        const y1h = y1 + (fxrand() * yOff) - (yOff / 2);
        const y2h = y1 - (fxrand() * yOff) - (yOff / 2);

        const xOff = w / 2;
        const x1 = (fxrand() * w);
        const x2 = (fxrand() * w);
        const x1h = x1 + (fxrand() * xOff) - (xOff / 2);
        const x2h = x2 - (fxrand() * xOff) - (xOff / 2);

        const a = new Point(x1, y1);
        const d = new Point(x2, y2);
        const c = new Point(x1h, y1h);
        const b = new Point(x2h, y2h);
        const step = 1 / n;
        for (let t = 0; t <= 1; t += step) {
            const point = Bezier.cubicBezier(a, b, c, d, t);
            this._graph.addNode(new Vector(point.x + fxrand() - 0.5, point.y + fxrand() - 0.5));
        }

        this._graph.makeEdges();
    }
}
