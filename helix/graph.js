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
    _vector = new Vector(0, 0);
    _kdTree;

    get points() {
        return this._nodes.map(n => n.point);
    }

    get root() {
        return this._nodes[0];
    }

    get kdTree() {
        return this._kdTree;
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
        const width = window.innerWidth, height = window.innerHeight;
        const moveRight = new Vector(0.75, 0);
        this._kdTree = new KdTree(this._nodes);
        const start = this.root;
        let root = this.root;
        do {
            if(root.point.y < -300 || root.point.y > height + 300 ||
                root.point.x > width + 300) {
                root = root.next.b;
                continue;
            }
            this._vector.point = root.point;
            const nearest = this._kdTree.findNearest(root);
            this._vector.pushFrom(nearest, 1000, 100, 100);
            this._vector.pullTo(nearest, 1000, 20, 50);
            if(root.next) {
                this._vector.pullTo(root.next.b, 15, 10, 15);
            }
            this._vector.addTo(moveRight);
            root = root.next?.b;
        } while(root !== start);
    }
}
