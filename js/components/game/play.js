import './bone';
import swal from 'sweetalert';
import Auth from './../../Auth';
import Piece from './../../Piece';

module.exports = {
    template: require('./../../templates/game/play.html'),

    data() {
        return {
            game: null,
            root: new Piece(null, false, 'root'),
            playerPieces: [],
            selectedPiece: null
        };
    },

    ready() {
        socket.on('game.left', (response) => {
            let user = _.findWhere(this.game.users, {id: response.data.id});
            this.game.users.$remove(user);
            this.game.joined -= 1;
        });

        this.loadGame();
    },

    computed: {
        opponents() {
            let players = [];

            for (let i in this.game.users) {
                if (this.game.users[i].id != Auth.user().id) {
                    players.push(this.game.users[i]);
                }
            }

            return players;
        }
    },

    methods: {
        /**
         * Load the game.
         */
        loadGame() {
            socket.send('game.load', {hash: this.$route.params.hash})
                .then(this.onLoadSuccess)
                .catch(this.onLoadError);
        },

        /**
         * Handle load game success.
         *
         * @param  {Object} response
         */
        onLoadSuccess(response) {
            this.game = response.data.game;

            // Add player pieces.
            for (let i = 0; i < response.data.pieces.length; i++) {
                this.playerPieces.push(new Piece(response.data.pieces[i]));
            }

            this.root.calculateCoords(null);
            this.addGridPositions(this.root);

            setTimeout(() => {
                this.zoomable();
                this.draggable();
            }, 10);

            this.$on('piece.dropped', () => {
                this.playerPieces.$remove(this.selectedPiece);
                this.selectedPiece = null;
            });
        },

        /**
         * Handle load game error.
         */
        onLoadError(response) {
            let title = 'Opps!';
            let text = response.status == 422 ? response.data :
                        'Something went wrong. Please try again.';

            if (response.status == 404) {
                title = 'Error 404';
                text = 'The game could not be found!';
            }

            swal({
                type: 'error',
                title: title,
                text: text,
                confirmButtonText: 'Ok'
            }, () => {
                this.$router.go({name: 'game.browse'});
            });
        },

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

                    // Broadcast event to remove all placeholders.
                    this.$broadcast('placeholders.remove');
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
