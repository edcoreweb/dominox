import Const from './Const';

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

        if (this.vertical) {
            this.width = Const.PIECE_HEIGHT;
            this.height = Const.PIECE_WIDTH;
        } else {
            this.width = Const.PIECE_WIDTH;
            this.height = Const.PIECE_HEIGHT;
        }
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
        return this.first == this.second;
    }

    isRoot() {
        if (this.coords) {
            return this.coords.x == 0 &&
                this.coords.y ==0;
        }

        return false;
    }

    getChildren() {
        return this.children;
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    setCoords(coords) {
        this.coords = coords;
    }

    getCoords() {
        return this.coords;
    }

    canAdd() {
        if (this.isRoot()) {
            return this.children.length < 2;
        } else if (this.isDouble()) {
            return this.children.length < 3;
        }

        return !this.hasChildren();
    }

    /**
     * Calculate grid position relative to parent
     * @param  {Piece} parent
     */
    calculateCoords(parent) {
        let coords = {};
        let piece = this;

        if (piece.direction == 'root' || !parent) {
            coords.x = 0;
            coords.y = 0;

            piece.setCoords(coords);
            return;
        }

        let pCoords = parent.getCoords();

        switch(piece.direction) {
            case 'up':
                if (piece.corner == 'up') {
                    coords.x = pCoords.x;
                    coords.y = pCoords.y + parent.getHeight();
                } else if (piece.corner == 'down') {
                    coords.x = pCoords.x + parent.getHeight();
                    coords.y = pCoords.y + parent.getHeight();
                } else {
                    coords.x = piece.isDouble ? (pCoords.x - (piece.height / 2)) : pCoords.x;
                    coords.y = pCoords.y + parent.getHeight();
                }
                break;

            case 'down':
                if (piece.corner == 'up') {
                    coords.x = pCoords.x;
                    coords.y = pCoords.y - piece.height;
                } else if (piece.corner == 'down') {
                    coords.x = pCoords.x + parent.getHeight();
                    coords.y = pCoords.y - piece.height;
                } else {
                    coords.x = piece.isDouble ? (pCoords.x - (piece.height / 2)) : pCoords.x;
                    coords.y = pCoords.y - piece.height;
                }
                break;

            case 'left':
                if (piece.corner == 'up') {
                    coords.x = pCoords.x - piece.width;
                    coords.y = pCoords.y + parent.getWidth();
                } else if (piece.corner == 'down') {
                    coords.x = pCoords.x - piece.width;
                    coords.y = pCoords.y;
                } else {
                    coords.x = pCoords.x - piece.width;
                    coords.y = piece.isDouble ? (pCoords.y - (piece.width / 2)) : pCoords.y;
                }
                break;

            case 'right':
                if (piece.corner == 'up') {
                    coords.x = pCoords.x + parent.getWidth();
                    coords.y = pCoords.y + parent.getWidth();
                } else if (piece.corner == 'down') {
                    coords.x = pCoords.x + parent.getWidth();
                    coords.y = pCoords.y;
                } else {
                    coords.x = pCoords.x + parent.getWidth();
                    coords.y = piece.isDouble ? (pCoords.y - (piece.width / 2)) : pCoords.y;
                }
                break;

            default:
                break;
        }

        piece.setCoords(coords);
    }
}

module.exports = Piece;
