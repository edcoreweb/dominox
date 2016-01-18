
class Piece {
    /**
     * Create a new piece instance.
     */
    constructor(parent, attributes) {
        this._parent = parent;

        this.corner = attributes.corner;
        this.vertical = attributes.vertical;
        this.direction = attributes.direction;
        this.first_half = attributes.first_half;
        this.second_half = attributes.second_half;

        return this;
    }

    generateHTML() {
        return '';
    }
}

module.exports = Piece;
