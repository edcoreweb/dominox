// import Auth from './../../Auth';
import Piece from './../../Piece';
import './bone';
import 'jquery.panzoom';

let rootNode = new Piece('66', false, 'root', null);

rootNode.addChildren([
    new Piece('56', false, 'left', null).addChildren([
        new Piece('23', true, 'up', 'up').addChildren([
            new Piece('00', false, 'left', 'up'),
            new Piece('00', false, 'right', 'up'),
            new Piece('00', true, 'up', null).addChildren([
                new Piece('33', false, 'up', null)
            ])
        ]),
        new Piece('04', true, 'down', 'up').addChildren([
            new Piece('00', false, 'left', 'down'),
            new Piece('00', false, 'right', 'down'),
            new Piece('00', true, 'down', null).addChildren([
                new Piece('33', false, 'down', null)
            ])
        ]),
        new Piece('11', false, 'left', null).addChildren([
            new Piece('33', true, 'left', null)
        ])
    ]),
    new Piece('13', false, 'right', null).addChildren([
        new Piece('42', true, 'up', 'up'),
        new Piece('46', true, 'up', 'down'),
        new Piece('22', true, 'down', 'up'),
        new Piece('52', true, 'down', 'down'),
        new Piece('33', false, 'right', null).addChildren([
            new Piece('33', true, 'right', null)
        ])
    ])
]);

var playerCards = [
    {
        name: '1',
        corner: null,
        vertical: true,
        direction: 'root'
    },
    {
        name: '1',
        corner: null,
        vertical: true,
        direction: 'right'
    },
    {
        name: '1',
        corner: null,
        vertical: true,
        direction: 'right'
    }
];

module.exports = {
    template: require('./../../templates/game/main.html'),

    data() {
        return {
            selected: null,
            root: rootNode,
            bones: playerCards
        };
    },

    ready() {
        this.root.calculateCoords(null);
        this.setBoardPiecesGridPositions(this.root);
    },

    methods: {
        /**
         * Add grin positions for every board piece.
         * @param {Piece} nodePiece
         */
        setBoardPiecesGridPositions(nodePiece) {
            let children = nodePiece.getChildren();

            for(let i = 0; i < children.length; i++) {
                children[i].calculateCoords(nodePiece);

                if (children[i].hasChildren()) {
                    this.setBoardPiecesGridPositions(children[i]);
                }
            }
        },
    }
};
