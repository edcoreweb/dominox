import './bone';
import './player-hand';
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
            playerDisabled: true
        };
    },

    ready() {
        socket.on('game.left', (response) => {
            let user = _.findWhere(this.game.users, {id: response.data.id});
            this.game.users.$remove(user);
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
            // Set the game.
            this.game = response.data.game;

            // Set the player pieces.
            for (let i = 0; i < response.data.pieces.length; i++) {
                this.playerPieces.push(new Piece(response.data.pieces[i]));
            }

            // If is not player turn, disable pieces.
            this.playerDisabled = response.data.player_turn != Auth.user().id;

            this.root.calculateCoords(null);
            this.addGridPositions(this.root);

            setTimeout(() => this.zoomable(), 10);

            // Remove player piece when dropped.
            this.$on('piece.dropped', (piece) => {
                this.playerPieces.$remove(piece);

                this.check();
                this.playerDisabled = false;
            });

            this.check();
        },

        check() {
            let placeable = [];

            this.getPlaceablePieaces(this.root, this.playerPieces, placeable);

            for (let i = 0; i < this.playerPieces.length; i++) {
                this.playerPieces[i].disabled = placeable.indexOf(this.playerPieces[i]) == -1;
            }
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

        onDragStart(piece) {
            this.$broadcast('placeholders.add', piece);
        },

        onDragStop() {
            this.$broadcast('placeholders.remove');
        },

        getPlaceablePieaces(piece, playerPieces, placeable) {
            for (let i in playerPieces) {
                if (piece.isRoot() && playerPieces[i].isDouble()) {
                    placeable.push(playerPieces[i]);
                }

                if (piece.first == playerPieces[i].first ||
                    piece.second == playerPieces[i].second ||
                    piece.first == playerPieces[i].second ||
                    piece.second == playerPieces[i].first) {
                    placeable.push(playerPieces[i]);
                }
            }

            if (!piece.hasChildren()) {
                return;
            }

            let children = piece.getChildren();

            for (let i = 0; i < children.length; i++) {
                this.getPlaceablePieaces(children[i], playerPieces, placeable);
            }
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
                });
            });
        }
    }
};
