import Piece from './../../Piece';
import Rectangle from './../../Rectangle';

let generatePlaceholders = (piece, rootPiece) => {
    let placeholders = [];

    if (piece.isDouble()) {
        placeholders.push(
            new Piece(null, true, 'up', null),
            new Piece(null, true, 'down', null),
            new Piece(null, false, 'left', null),
            new Piece(null, false, 'right', null)
        );
    } else {
        if (piece.vertical) {
            if (piece.direction == 'up') {
                placeholders.push(
                    new Piece(null, true, 'up', null),
                    new Piece(null, false, 'left', 'up'),
                    new Piece(null, false, 'right', 'up')
                );
            } else if (piece.direction == 'down') {
                placeholders.push(
                    new Piece(null, true, 'down', null),
                    new Piece(null, false, 'left', 'down'),
                    new Piece(null, false, 'right', 'down')
                );
            } else {
                placeholders.push(
                    new Piece(null, true, 'up', null),
                    new Piece(null, true, 'down', null),
                    new Piece(null, false, piece.direction, null)
                );
            }
        } else {
            if (piece.direction == 'left') {
                placeholders.push(
                    new Piece(null, false, 'left', null),
                    new Piece(null, true, 'up', 'up'),
                    new Piece(null, true, 'down', 'up')
                );
            } else if (piece.direction == 'right') {
                placeholders.push(
                    new Piece(null, false, 'right', null),
                    new Piece(null, true, 'up', 'down'),
                    new Piece(null, true, 'down', 'down')
                );
            } else if (piece.direction == 'root') {
                placeholders.push(
                    new Piece(null, false, 'right', null),
                    new Piece(null, false, 'left', null)
                );
            } else {
                placeholders.push(
                    new Piece(null, false, 'left', null),
                    new Piece(null, false, 'right', null),
                    new Piece(null, true, piece.direction, null)
                );
            }
        }
    }

    for (let i = 0; i < placeholders.length; i++) {
        placeholders[i].calculateCoords(piece);
    }

    deleteOvelapps(placeholders, rootPiece);

    return placeholders;
};

let deleteOvelapps = (placeholders, piece) => {
    let pieceRect = new Rectangle(
        piece.getCoords().x, piece.getCoords().y,
        piece.getWidth(), piece.getHeight()
    );

    for (let i = 0; i < placeholders.length; i++) {
        let rectPlaceholder = new Rectangle(
            placeholders[i].getCoords().x, placeholders[i].getCoords().y,
            placeholders[i].getWidth(), placeholders[i].getHeight()
        );

        if (pieceRect.isOverlapping(rectPlaceholder)) {
            placeholders.splice(i, 1);
        }
    }

    if (!piece.hasChildren()) {
        return;
    }

    let children = piece.getChildren();

    for (let i = 0; i < children.length; i++) {
        deleteOvelapps(placeholders, children[i]);
    }
};

module.exports = {
    generatePlaceholders: generatePlaceholders
};
