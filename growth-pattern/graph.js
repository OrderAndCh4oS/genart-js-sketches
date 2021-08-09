const getMidpoint = (p1, p2) => [(p1.x + p2.x) * 0.5, (p1.y + p2.y) * 0.5]

class Node {
    _point;
    _edges = [];

    constructor(x, y) {
        this._point = new Point(x, y);
    }

    addEdge(node) {
        const edge = new Edge(this, node);
        this._edges.push(edge);

        return edge;
    }

    removeEdge(edge) {
        const index = this._edges.indexOf(edge);
        if (index > -1) {
            this._edges.splice(index, 1);
        }
    }

    get point() {
        return this._point;
    }
}

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
}

class Graph {
    _nodes = [];
    _edges = [];

    addNode(x, y) {
        const node = new Node(x, y);
        const edge = this._nodes.push(node);

        this._edges.push(edge);
    }

    addEdge(a, b) {
        a.addEdge(b);
    }

    splitEdge(edge) {
        edge.a.removeEdge(edge);
        edge.b.removeEdge(edge);
        this.removeEdge(edge);
        const [x, y] = getMidpoint(edge.a.point, edge.b.point)
        const node = new Node(x, y);
        edge.a.addEdge(node)
        node.addEdge(edge.b);
    }

    removeEdge(edge) {
        const index = this._edges.indexOf(edge);
        if (index > -1) {
            this._edges.splice(index, 1);
        }
    }

    updateNodes() {

    }
}
