class Tree {
    _x;
    _y;
    _nodes;
    _activeNodes;
    _root;
    _attractors;
    _removeAttractors;
    _attractorCount;
    _finished;
    _strokeWeight;
    _scale

    constructor(x, y, strokeWeight = 0.5, scale = 1.01) {
        this._x = x;
        this._y = y;
        this._strokeWeight = strokeWeight;
        this._scale = scale;
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
        const diagonalLength = Math.sqrt(
            window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight,
        );
        this._attractors = new Attractors();
        this._attractorCount = diagonalLength * 3;
        this._attractors.initRandom(this._attractorCount);
        this._finished = false;

    }

    update() {
        this._removeAttractors.forEach((attractor) => {
            this._attractors.remove(attractor);
        });
        if(this._attractors.attractors.length < this._attractorCount * 0.05) {
            this._finished = true;
            return;
        }
        const kdTree = new KdTree(this._attractors.attractors);
        const nextNodes = [];
        const removeNodes = [];
        this._removeAttractors = new Set();
        let activeCount = this._activeNodes.length;
        if(this._activeNodes.length > 10) {
            activeCount = 10;
        }
        for(let i = 0; i < activeCount; i++) {
            let node = this._activeNodes[i];
            const nearestNodes = kdTree.findKnnInRadius(10, 33, node);
            if(!nearestNodes.length) {
                removeNodes.push(i);
                continue;
            }
            const v1 = new Vector(0, 0);
            for(const attractor of nearestNodes) {
                v1.addTo(attractor);
                if(node.distanceTo(attractor) < 32) {
                    this._removeAttractors.add(attractor);
                }
            }
            v1.divideBy(nearestNodes.length);
            v1.subtractFrom(node);
            v1.divideBy(1);
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
            let lineWidth = this._strokeWeight;
            let i = 0;
            while(currentNode.parent) {
                context.lineWidth = lineWidth;
                context.beginPath();
                context.moveTo(currentNode.x, currentNode.y);
                context.lineTo(currentNode.parent.x, currentNode.parent.y);
                context.stroke();
                lineWidth *= this._scale;
                currentNode = currentNode.parent;
                i++;
            }
        }
    }
}
