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

    get length() {
        const dx = this._b.x - this._a.x, dy = this._b.y - this._a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

class Graph {
    _nodes = [];
    _edges = [];

    get points() {
        return this._nodes.map(n => n.point);
    }

    get root() {
        return this._nodes[0];
    }

    get nodes() {
        return this._nodes;
    }

    get edges() {
        return this._edges;
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
        this.addEdge(this._nodes[this._nodes.length - 1], this._nodes[0]);
    }

    splitEdge(edge) {
        this.removeEdge(edge);
        const node = new Node(new Vector(edge.midpoint.x, edge.midpoint.y));
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
}
