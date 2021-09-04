class Tree {
    _x;
    _y;
    _nodes;
    _activeNodes;
    _root;
    _attractors;
    _removeAttractors;
    _finished;

    constructor(x, y) {
        this._x = x;
        this._y = y;
        this.init();
    }

    get finished() {
        return this._finished;
    }

    init() {
        this._root = new LinkedListNode(this._x, this._y);
        this._nodes = [];
        this._activeNodes = [];
        this._removeAttractors = new Set();
        this._nodes.push(this._root);
        this._activeNodes.push(this._root);
        this._attractors = new Attractors();
        this._finished = false;
        const diagonalLength = Math.sqrt(
            window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight
        );
        this._attractors.initRandom(diagonalLength * 0.2);
    }

    update() {
        this._removeAttractors.forEach((attractor) => {
            this._attractors.remove(attractor);
        });
        if(!this._attractors.attractors.length) {
            this._finished = true;
            return;
        }
        const kdTree = new KdTree(this._attractors.attractors);
        const nextNodes = [];
        const removeNodes = [];
        this._removeAttractors = new Set();
        for(let i = 0; i < this._activeNodes.length; i++) {
            let node = this._activeNodes[i];
            const nearestNodes = kdTree.findKnnInRadius(5, 175, node);
            if(!nearestNodes.length) {
                removeNodes.push(i);
                continue;
            }
            const v1 = new Vector(0, 0);
            for(const attractor of nearestNodes) {
                v1.addTo(attractor);
                if(node.distanceTo(attractor) < 125) {
                    this._removeAttractors.add(attractor);
                }
            }
            v1.divideBy(nearestNodes.length);
            v1.subtractFrom(node);
            v1.divideBy(1.25);
            const nextNode = node.clone();
            nextNode.vector.addTo(v1);
            nextNodes.push(nextNode);
            node.addNode(nextNode);
        }
        this._nodes.push(...nextNodes);
        this._activeNodes.push(...nextNodes);
        for(let i = removeNodes.length; i > 0; i--) {
            this._activeNodes.splice(removeNodes[i], 1);
        }
    }

    draw() {
        for(const node of this._nodes) {
            if(node.children.length) continue;
            let currentNode = node;
            let lineWidth = 0.2;
            let i = 0;
            while(currentNode.parent) {
                context.lineWidth = lineWidth;
                context.beginPath();
                context.moveTo(currentNode.x, currentNode.y);
                context.lineTo(currentNode.parent.x, currentNode.parent.y);
                context.stroke();
                // context.beginPath();
                // context.arc(currentNode.parent.x, currentNode.parent.y, lineWidth / 2, 0, 2 * Math.PI);
                // context.fill();
                lineWidth *= 1.35;
                currentNode = currentNode.parent;
                i++;
            }
        }
        // for(const attractor of this._attractors.attractors) {
        //     context.beginPath();
        //     context.arc(attractor.x, attractor.y, 1, 0, 2 * Math.PI);
        //     context.fill();
        // }
    }
}
