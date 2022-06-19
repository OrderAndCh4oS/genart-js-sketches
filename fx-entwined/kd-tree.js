class KdTree {
    _nodes;
    _tree;
    _k;
    _best = null;
    _bestDistance = Infinity;
    _found = [];
    _visited = 0;

    constructor(nodes = [], k = 2) {
        this._nodes = nodes;
        this._k = k;
        this._tree = this.buildTree(nodes);
    }

    get tree() {
        return this._tree;
    }

    buildTree(nodes, d = 0) {
        if(!nodes.length || !nodes) return null;
        const axis = d % this._k;

        let sortedNodes = [...nodes];

        if(axis === 0) {
            sortedNodes.sort((a, b) => a.x - b.x);
        } else if(axis === 1) {
            sortedNodes.sort((a, b) => a.y - b.y);
        } else if(axis === 2) {
            sortedNodes.sort((a, b) => a.z - b.z);
        }

        const median = ~~(sortedNodes.length / 2);
        const pivot = sortedNodes[median];

        sortedNodes[median].setChildren(
            this.buildTree(sortedNodes.slice(0, median), d + 1),
            this.buildTree(sortedNodes.slice(median + 1, sortedNodes.length), d + 1),
        );

        return pivot;
    }

    findNearest(target) {
        if(this._tree == null) throw new Error('Tree is empty!');
        this._best = null;
        this._bestDistance = Infinity;
        this._nearest(this._tree, target, 0);

        return this._best;
    }

    findKnn(k, target) {
        this._found = [];
        while(this._found.length < k) {
            const nearest = this.findNearest(target);
            this._found.push(nearest);
        }
        return this._found;
    }

    findKnnInRadius(k, r, target) {
        this._found = [];
        while(this._found.length < k) {
            const nearest = this.findNearest(target);
            if(!nearest) break;
            if(target.distanceTo(nearest) > r) {
                return this._found;
            }
            this._found.push(nearest);
        }

        return this._found;
    }

    findInRadius(r, target) {
        let nearest;
        do {
            nearest = this.findNearest(target);
            if(!nearest) break;
            if(target.distanceTo(nearest) > r) {return this._found;}
            this._found.push(nearest);
        } while(target.distanceTo(nearest) < r);

        return this._found;
    }

    _nearest(root, target, depth) {
        if(root == null) return;
        const distance = root.distanceTo(target);
        if((this._best == null || distance < this._bestDistance) && !root.equals(target) &&
            !this._found.includes(root)) {
            this._bestDistance = distance;
            this._best = root;
        }
        if(this._bestDistance === 0) return;
        const axis = depth % this._k;

        const dx = root.coords[axis] - target.coords[axis];

        this._nearest(dx > 0 ? root.left : root.right, target, depth + 1);
        this._nearest(dx > 0 ? root.right : root.left, target, depth + 1);
    }
}
