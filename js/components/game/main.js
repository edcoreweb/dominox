// import Auth from './../../Auth';
import Piece from './../../Piece';
import './bone';
import 'jquery.panzoom';

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

var playerPieces = [
    new Piece('22'), new Piece('66'), new Piece('36'), new Piece('45')
];

module.exports = {
    template: require('./../../templates/game/main.html'),

    data() {
        return {
            selected: null,
            root: rootNode,
            playerPieces: playerPieces,
            selectedPiece: null
        };
    },

    ready() {
        this.root.calculateCoords(null);
        this.setBoardPiecesGridPositions(this.root);

        this.boardZoom();

        $('.player-piece').draggable({
            revert: 'invalid',
            revertDuration: 300,
            containment: 'document',
            helper: 'clone',
            cursor: 'move',
            start: (e, ui) => {
                console.log(this.selectedPiece);
                $(e.target).addClass('player-piece-drag');
                ui.helper.selectedPiece = this.selectedPiece;
                this.$broadcast('placeholders.add', this.selectedPiece);
            },
            stop: (e) => {
                $(e.target).removeClass('player-piece-drag');
                this.$broadcast('placeholders.remove');
                this.selectedPiece = null;
            }
        });

        // $('.player-hand').owlCarousel();
    },

    methods: {
        selectPlayerPiece(piece) {
            this.selectedPiece = piece;
        },

        /**
         * Add grin positions for every board piece.
         *
         * @param {Piece} nodePiece
         */
        setBoardPiecesGridPositions(nodePiece) {
            let children = nodePiece.getChildren();

            for (let i = 0; i < children.length; i++) {
                children[i].calculateCoords(nodePiece);

                if (children[i].hasChildren()) {
                    this.setBoardPiecesGridPositions(children[i]);
                }
            }
        },

        boardZoom() {
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

            // panzoom.on('panzoomend', (e, panzoom, matrix, changed) => {
            //     if (!changed) {
            //         let target = $(e.target);
            //         console.log('click' + target.data('name'));
            //         target.trigger('click' + target.data('name'));
            //     }
            // });
        }
    }
};
