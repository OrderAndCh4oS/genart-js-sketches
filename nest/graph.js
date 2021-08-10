class Edge {
    _a;
    _b;

    constructor(a, b) {
        this._a = a;
        this._b = b;
    }

    get a() {
        return this._a;
    }

    get b() {
        return this._b;
    }

    get midpoint() {
        return new Point((this._a.x + this._b.x) * 0.5, (this._a.y + this._b.y) * 0.5);
    }
}

class Graph {
    _nodes = [];
    _edges = [];
    _vector = new Vector(0, 0);

    get points() {
        return this._nodes.map(n => n.point);
    }

    get root() {
        return this._nodes[0];
    }

    addNode(point) {
        const node = new Node(point);
        this._nodes.push(node);
    }

    addEdge(a, b) {
        const edge = a.makeEdge(b);
        this._edges.push(edge);
    }

    makeEdges() {
        for(let i = 0; i < this._nodes.length - 1; i++) {
            this.addEdge(this._nodes[i], this._nodes[i + 1]);
        }
    }

    splitEdge(edge) {
        this.removeEdge(edge);
        const node = new Node(edge.midpoint);
        const edgeOne = edge.a.makeEdge(node);
        const edgeTwo = node.makeEdge(edge.b);
        this._edges.push(edgeOne);
        this._edges.push(edgeTwo);
        this._nodes.push(node);
    }

    removeEdge(edge) {
        const index = this._edges.indexOf(edge);
        if(index > -1) {
            this._edges.splice(index, 1);
        }
    }

    update() {
        const kdTree = new KdTree(this._nodes);
        let root = this._nodes[0];
        while(root.next) {
            this._vector.point = root.point;
            const nearest = kdTree.findNearest(root);
            if(this._vector.distanceTo(nearest) > 25) {
                this._vector.pullTo(nearest);
            } else {
                this._vector.pushFrom(nearest);
            }
            root = root.next.b;
        }
        if(this._edges.length < 1000) {
            this.splitEdge(this._edges[~~(Math.random() * this._edges.length)])
        }
    }
}
