
class Piece {
    /**
     * Create a new piece instance.
     */
    // constructor(parent, attributes) {
    //     this._parent = parent;

    //     this.corner = attributes.corner;
    //     this.vertical = attributes.vertical;
    //     this.direction = attributes.direction;
    //     this.first_half = attributes.first_half;
    //     this.second_half = attributes.second_half;

    //     return this;
    // }

    generateHTML() {
        let content = $('<div/>');
        content.addClass('piece-content');
        content.prop('@click','select');

        let bone = $('<div/>').addClass('piece left');

        bone.append(content);

        return bone;
    }
}

module.exports = Piece;
