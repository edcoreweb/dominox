import Const from './Const';

class Piece {
    /**
     * Create a new piece instance.
     */
    constructor(name = null, vertical = false, direction = 'left', corner = null) {
        this.name = name;
        this.corner = corner;
        this.vertical = vertical;
        this.direction = direction;
        this.children = [];

        if (name) {
            this.first = parseInt(this.name.charAt(0));
            this.second = parseInt(this.name.charAt(1));
            this.isPlaceholder = false;
        } else {
            this.isPlaceholder = true;
        }

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

    removePlaceholders() {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].isPlaceholder) {
                this.children.splice(i, 1);
                i--;
            }
        }
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
        if (!this.isPlaceholder) {
            return this.first == this.second;
        }

        return false;
    }

    isRoot() {
        if (this.coords) {
            return this.coords.x == 0 && this.coords.y == 0;
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

    isInDoublePos(parent) {
        if (!parent) {
            return false;
        }

        return this.isDouble() &&
            parent.getVertical() != this.vertical;
    }

    hasOpenEndValue(value) {
        switch (this.direction) {
        case 'up':
        case 'left':
            return this.first == value;
        case 'down':
        case 'right':
            return this.second == value;
        case 'root':
            return this.first == value ||
                this.second == value;
        }

        return false;
    }

    shouldFlipValuesVertical(parent) {
        if (this.direction == 'up' && !this.corner) {
            return parent.first != this.second;
        }

        if (!this.corner) {
            if (this.direction == 'left') {
                return parent.first != this.second;
            }

            if (this.direction == 'right') {
                return parent.first != this.first;
            }
        }

        if (this.corner == 'up') {
            if (this.direction == 'left') {
                return parent.first != this.second;
            }

            if (this.direction == 'right') {
                return parent.first != this.first;
            }
        }

        if (this.direction == 'down' && !this.corner) {
            return parent.second != this.first;
        }

        if (this.corner == 'down') {
            if (this.direction == 'left') {
                return parent.second != this.second;
            }

            if (this.direction == 'right') {
                return parent.second != this.first;
            }
        }

        return false;
    }

    shouldFlipValuesHorizontal(parent) {
        if (this.direction == 'left' && !this.corner) {
            return parent.first != this.second;
        }

        if (this.direction == 'up') {
            if (this.corner == 'up') {
                return parent.first != this.second;
            }

            if (!this.corner) {
                return parent.first != this.second;
            }

            if (this.corner == 'down') {
                return parent.second != this.second;
            }
        }

        if (this.direction == 'right' && !this.corner) {
            return parent.second != this.first;
        }

        if (this.direction == 'down') {
            if (this.corner == 'up') {
                return parent.first != this.first;
            }

            if (!this.corner) {
                return parent.first != this.first;
            }

            if (this.corner == 'down') {
                return parent.second != this.first;
            }
        }

        return false;
    }

    hasOpenEndSpots(value) {
        let flag = true;

        if (this.isRoot()) {
            flag = flag && this.children.length < 4;
        } else if (this.isDouble()) {
            flag = flag && this.children.length < 3;
        } else {
            flag = flag && !this.hasChildren();
        }

        return flag && this.hasOpenEndValue(value);
    }

    getUpCoords(parent, piece) {
        let coords = {};
        let pCoords = parent.getCoords();

        if (piece.corner == 'up') {
            coords.x = pCoords.x;
            coords.y = pCoords.y + parent.getHeight();
        } else if (piece.corner == 'down') {
            coords.x = pCoords.x + parent.getHeight();
            coords.y = pCoords.y + parent.getHeight();
        } else {
            coords.x = this.getHorizontalDoubleCoord(parent, piece, pCoords);
            coords.y = pCoords.y + parent.getHeight();
        }

        return coords;
    }

    getDownCoords(parent, piece) {
        let coords = {};
        let pCoords = parent.getCoords();

        if (piece.corner == 'up') {
            coords.x = pCoords.x;
            coords.y = pCoords.y - piece.height;
        } else if (piece.corner == 'down') {
            coords.x = pCoords.x + parent.getHeight();
            coords.y = pCoords.y - piece.height;
        } else {
            coords.x = this.getHorizontalDoubleCoord(parent, piece, pCoords);
            coords.y = pCoords.y - piece.height;
        }

        return coords;
    }

    getLeftCoords(parent, piece) {
        let coords = {};
        let pCoords = parent.getCoords();

        if (piece.corner == 'up') {
            coords.x = pCoords.x - piece.width;
            coords.y = pCoords.y + parent.getWidth();
        } else if (piece.corner == 'down') {
            coords.x = pCoords.x - piece.width;
            coords.y = pCoords.y;
        } else {
            coords.x = pCoords.x - piece.width;
            coords.y = this.getVerticalDoubleCoord(parent, piece, pCoords);
        }

        return coords;
    }

    getRightCoords(parent, piece) {
        let coords = {};
        let pCoords = parent.getCoords();

        if (piece.corner == 'up') {
            coords.x = pCoords.x + parent.getWidth();
            coords.y = pCoords.y + parent.getWidth();
        } else if (piece.corner == 'down') {
            coords.x = pCoords.x + parent.getWidth();
            coords.y = pCoords.y;
        } else {
            coords.x = pCoords.x + parent.getWidth();
            coords.y = this.getVerticalDoubleCoord(parent, piece, pCoords);
        }

        return coords;
    }

    getVerticalDoubleCoord(parent, piece, pCoords) {
        if (piece.isInDoublePos(parent)) {
            return pCoords.y - (piece.width / 2);
        } else if (this.vertical != parent.vertical) {
            return pCoords.y + (piece.height / 2);
        } else {
            return pCoords.y;
        }
    }

    getHorizontalDoubleCoord(parent, piece, pCoords) {
        if (piece.isInDoublePos(parent)) {
            return pCoords.x - (piece.height / 2);
        } else if (piece.vertical != parent.vertical) {
            return pCoords.x + (piece.width / 2);
        } else {
            return pCoords.x;
        }
    }

    /**
     * Calculate grid position relative to parent
     *
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

        switch(piece.direction) {
        case 'up':
            coords = this.getUpCoords(parent, piece);
            break;
        case 'down':
            coords = this.getDownCoords(parent, piece);
            break;
        case 'left':
            coords = this.getLeftCoords(parent, piece);
            break;
        case 'right':
            coords = this.getRightCoords(parent, piece);
            break;
        }

        piece.setCoords(coords);
    }
}

module.exports = Piece;
