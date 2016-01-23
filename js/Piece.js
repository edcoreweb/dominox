
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

        this.first = parseInt(this.name.charAt(0));
        this.second = parseInt(this.name.charAt(1));

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

    setValue(first, second) {
        this.first = first;
        this.second = second;
    }

    getFirst() {
        return this.first;
    }

    getSecond() {
        return this.second;
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
