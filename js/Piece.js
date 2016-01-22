
class Piece {
    /**
     * Create a new piece instance.
     */
    constructor(name, vertical = false, direction = 'left', corner = null) {
        this.name = name;
        this.corner = corner;
        this.vertical = vertical;
        this.direction = direction;
        this.children = [];

        return this;
    }

    addChild(child) {
        this.children.push(child);

        return this;
    }

    addChildren(children) {
        this.children = this.children.concat(children);

        return this;
    }

    setCorner(corner) {
        this.corner = corner;
    }

    setVertical(vertical) {
        this.vertical = vertical;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    getCorner() {
        return this.corner;
    }

    getVertical() {
        return this.vertical;
    }

    getDirection() {
        return this.direction;
    }

    hasChildren() {
        return this.children &&
            this.children.length;
    }

    isDouble() {
        return false;
    }

    getChildren() {
        return this.children;
    }
}

module.exports = Piece;
