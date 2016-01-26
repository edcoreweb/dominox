import './bone';
import 'jquery.panzoom';
import Piece from './../../Piece';

import 'jquery-ui/draggable';
import 'jquery-ui/droppable';

let rootNode = new Piece('66', false, 'root', null);

// rootNode.addChildren([
//     new Piece('56', false, 'left', null).addChildren([
//         new Piece('23', true, 'up', 'up').addChildren([
//             new Piece('00', false, 'left', 'up').addChildren([
//                 new Piece('42', false, 'left', null)
//             ]),
//             new Piece('00', false, 'right', 'up'),
//             new Piece('00', true, 'up', null).addChildren([
//                 new Piece('33', false, 'up', null)
//             ])
//         ]),
//         new Piece('04', true, 'down', 'up').addChildren([
//             new Piece('00', false, 'left', 'down'),
//             new Piece('00', false, 'right', 'down'),
//             new Piece('00', true, 'down', null).addChildren([
//                 new Piece('33', false, 'down', null)
//             ])
//         ]),
//         new Piece('11', false, 'left', null).addChildren([
//             new Piece('33', true, 'left', null)
//         ])
//     ]),
//     new Piece('13', false, 'right', null).addChildren([
//         new Piece('42', true, 'up', 'up'),
//         new Piece('46', true, 'up', 'down'),
//         new Piece('22', true, 'down', 'up'),
//         new Piece('52', true, 'down', 'down'),
//         new Piece('33', false, 'right', null).addChildren([
//             new Piece('33', true, 'right', null)
//         ])
//     ])
// ]);

let playerPieces = [
    new Piece('22'), new Piece('66'), new Piece('63'), new Piece('54')
];

module.exports = {
    template: require('./../../templates/game/main.html'),

    data() {
        return {
            root: rootNode,
            playerPieces: playerPieces,
            selectedPiece: null
        };
    },

    ready() {
        this.root.calculateCoords(null);
        this.addGridPositions(this.root);

        this.zoomable();
        this.draggable();

        /**
         * Listen for dropped piece.
         */
        this.$on('piece.dropped', () => {
            this.playerPieces.$remove(this.selectedPiece);

            this.selectedPiece = null;

            // Broadcast event to remove all placeholders.
            this.$broadcast('placeholders.remove');
        });
    },

    methods: {
        /**
         * Set the selected player piece.
         *
         * @param  {Piece} piece
         */
        selectPlayerPiece(piece) {
            this.selectedPiece = piece;
        },

        /**
         * Add grin positions for every board piece.
         *
         * @param  {Piece} piece
         */
        addGridPositions(piece) {
            let children = piece.getChildren();

            for (let i = 0; i < children.length; i++) {
                children[i].calculateCoords(piece);

                if (children[i].hasChildren()) {
                    this.addGridPositions(children[i]);
                }
            }
        },

        /**
         * Make player pieces draggable.
         */
        draggable() {
            $('.player-piece').draggable({
                cursor: 'move',
                helper: 'clone',
                revert: 'invalid',
                revertDuration: 300,
                containment: 'document',

                start: (e, ui) => {
                    $(e.target).addClass('player-piece-drag');

                    ui.helper.selectedPiece = this.selectedPiece;
                    this.$broadcast('placeholders.add', this.selectedPiece);
                },

                stop: (e) => {
                    $(e.target).removeClass('player-piece-drag');
                }
            });
        },

        /**
         * Make board zoomable.
         */
        zoomable() {
            let panzoom = $('.game-board-inner').panzoom();

            panzoom.parent().on('mousewheel.focal', (e) => {
                let delta = e.delta || e.originalEvent.wheelDelta;
                let zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;

                panzoom.panzoom('zoom', zoomOut, {
                    focal: e,
                    animate: false,
                    increment: 0.1,
                    maxScale: 1
                    // disableZoom: true
                });
            });
        }
    }
};
