class Node {
    _point;
    _left;
    _right;

    constructor(point) {
        this._point = point;
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    get point() {
        return this._point;
    }

    get x() {
        return this._point._x;
    }

    get y() {
        return this._point._y;
    }

    get coords() {
        return this._point.coords;
    }

    distanceTo(p2) {
        return this._point.distanceTo(p2);
    };

    setChildren(left, right) {
        this._left = left;
        this._right = right;
    }

    equals(p2) {
        if(!p2 instanceof Node) return false;
        return this._point.equals(p2);
    }
}

class KdTree {
    _nodes;
    _tree;
    _k;
    _best = null;
    _bestDistance = Infinity;
    _visited = 0;

    constructor(nodes = [], k = 2) {
        this._nodes = nodes;
        this._k = k;
        this._tree = this.buildTree(nodes);
    }

    buildTree(nodes, d = 0) {
        if(!nodes.length || !nodes) return null;
        const axis = d % this._k;

        if(axis === 0) {
            nodes.sort((a, b) => a.x - b.x);
        } else if(axis === 1) {
            nodes.sort((a, b) => a.y - b.y);
        } else if(axis === 2) {
            nodes.sort((a, b) => a.z - b.z);
        }

        const median = ~~(nodes.length / 2);
        const pivot = nodes[median];

        nodes[median].setChildren(
            this.buildTree(nodes.slice(0, median), d + 1),
            this.buildTree(nodes.slice(median + 1, nodes.length), d + 1)
        );

        return pivot;
    }

    findNearest(target) {
        if (this._tree == null) throw new Error("Tree is empty!");
        this._best = null;
        this._bestDistance = Infinity;
        this._visited = 0;
        this._nearest(this._tree, target, 0);

        return this._best;
    }

    _nearest(root, target, depth) {
        if (root == null) return;
        this._visited++;
        const distance = root.distanceTo(target);
        if (!root.equals(target) && (this._best == null || distance < this._bestDistance)) {
            this._bestDistance = distance;
            this._best = root;
        }
        if (this._bestDistance === 0) return;
        const axis = depth % this._k;

        const dx = root.coords[axis] - target.coords[axis];
        
        this._nearest(dx > 0 ? root.left : root.right, target, depth + 1);
        if (dx * dx >= this._bestDistance) return;
        this._nearest(dx > 0 ? root.right : root.left, target, depth + 1);
    }

    get tree() {
        return this._tree;
    }
}
