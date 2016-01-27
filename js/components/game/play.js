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
            currentPlayer: null,

            playerPieces: [],
            playerDisabled: true
        };
    },

    ready() {
        socket.on('game.left', (response) => {
            let user = _.findWhere(this.game.users, {id: response.data.id});
            this.game.users.$remove(user);
        });

        socket.on('game.piece.added', (response) => {
            this.setCurrentPlayer(response.data.player_turn);

            if (response.data.user_id != Auth.user().id) {
                this.$broadcast('game.piece.add', response.data.piece, response.data.parent);
                // console.log('User ' + this.currentPlayer + ' has added piece', response.data.piece);
            }

            setTimeout(() => this.disablePlayerPieces(), 100);
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

            this.setCurrentPlayer(response.data.player_turn);

            this.root.calculateCoords(null);
            this.addGridPositions(this.root);

            setTimeout(() => this.zoomable(), 10);

            // Remove player piece when dropped.
            this.$on('piece.dropped', (playerPiece, droppedPiece, parentPiece) => {
                this.playerPieces.$remove(playerPiece);

                socket.send('game.piece.add', {
                    piece: droppedPiece.serialize(),
                    parent: parentPiece ? parentPiece.serialize() : null
                });

                this.playerDisabled = true;
                this.disablePlayerPieces();
            });

            this.disablePlayerPieces();
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
         * Set the current player.
         *
         * @param {Numer} id
         */
        setCurrentPlayer(id) {
            this.currentPlayer = id;
            this.playerDisabled = id != Auth.user().id;
        },

        onDragStart(piece) {
            this.$broadcast('placeholders.add', piece);
        },

        onDragStop() {
            this.$broadcast('placeholders.remove');
        },

        disablePlayerPieces() {
            let placeable = [];
            let playerPieces = this.playerPieces.slice(0);

            this.getPlaceablePieaces(this.root, playerPieces, placeable);

            for (let i = 0; i < this.playerPieces.length; i++) {
                this.playerPieces[i].disabled = this.playerDisabled || placeable.indexOf(this.playerPieces[i]) == -1;
            }
        },

        getPlaceablePieaces(piece, playerPieces, placeable) {
            for (let i = 0; i < playerPieces.length; i++) {
                if (piece.isPlaceholder && playerPieces[i].isDouble()) {
                    placeable.push(playerPieces[i]);
                    playerPieces.splice(i, 1);
                    i--;
                }

                if (!playerPieces[i]) continue;

                if (piece.hasOpenEndSpots(playerPieces[i].first) || piece.hasOpenEndSpots(playerPieces[i].second)) {
                    placeable.push(playerPieces[i]);
                    playerPieces.splice(i, 1);
                    i--;
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
