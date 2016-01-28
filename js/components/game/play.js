import './bone';
import './boneyard';
import './player-hand';
import swal from 'sweetalert';
import Auth from './../../Auth';
import Piece from './../../Piece';

module.exports = {
    template: require('./../../templates/game/play.html'),

    data() {
        return {
            game: null,
            root: null,
            currentPlayer: null,

            playerPieces: [],
            playerDisabled: true,

            boneyardDisabed: true
        };
    },

    ready() {
        socket.on('game.left', this.userHasLeft);
        socket.on('game.piece.added', this.pieceWasAdded);
        socket.on('game.piece.drawn', this.userHasDrawnPiece);
        socket.on('game.won', this.userHasWon);

        this.$on('game.piece.drawn', this.pieceWasDrawn);

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
        userHasWon(response) {
            let user = response.data;

            swal({
                title: user.id == Auth.user().id ? 'You won this round!' : user.name + ' won this round!',
                text: 'The next round will start in 2 seconds.',
                timer: 2000
            });

            setTimeout(() => {
                this.root = null;
                this.loadGame();
            }, 2000);
        },

        pieceWasDrawn(piece) {
            if (!piece) {
                return;
            }

            this.playerPieces.push(new Piece(piece));

            this.togglePlayerPieces();
        },

        userHasDrawnPiece() {
            this.game.yard_count -= 1;
        },

        userHasLeft(response) {
            let user = _.findWhere(this.game.users, {id: response.data.id});

            this.game.users.$remove(user);
        },

        pieceWasAdded(response) {
            this.setCurrentPlayer(response.data.player_turn);

            if (response.data.user_id != Auth.user().id) {
                this.$broadcast('game.piece.add', response.data.piece, response.data.parent);
            }

            this.togglePlayerPieces();
        },

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

            // Set the player pieces.
            for (let i = 0; i < response.data.pieces.length; i++) {
                this.playerPieces.push(new Piece(response.data.pieces[i]));
            }

            this.setCurrentPlayer(response.data.player_turn);

            this.setPieces(this.game.pieces);

            // Remove player piece when dropped.
            this.$on('piece.dropped', (playerPiece, droppedPiece, parentPiece) => {
                this.playerPieces.$remove(playerPiece);

                socket.send('game.piece.add', {
                    piece: droppedPiece.serialize(),
                    parent: parentPiece ? parentPiece.serialize() : null
                });

                this.playerDisabled = true;
                this.boneyardDisabed = true;
                this.togglePlayerPieces();
            });

            this.togglePlayerPieces();
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

        togglePlayerPieces() {
            let placeable = [];
            let playerPieces = this.playerPieces.slice(0);

            this.placeablePieaces(this.root, playerPieces, placeable);

            for (let i = 0; i < this.playerPieces.length; i++) {
                this.playerPieces[i].disabled = this.playerDisabled || placeable.indexOf(this.playerPieces[i]) == -1;
            }

            let disabled = this.playerPieces.filter(piece => piece.disabled);

            if (this.playerDisabled || disabled.length != this.playerPieces.length) {
                this.boneyardDisabed = true;
            } else {
                this.boneyardDisabed = false;
            }
        },

        placeablePieaces(piece, playerPieces, placeable) {
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
                this.placeablePieaces(children[i], playerPieces, placeable);
            }
        },

        setPieces(pieces) {
            let piece = pieces.shift();

            if (piece) {
                this.root = new Piece(piece.name, piece.vertical, piece.direction, piece.corner);
                this.buildPiecesTree(this.root, pieces, piece.id);
            } else {
                this.root = new Piece(null, false, 'root');
            }

            this.root.calculateCoords(null);
            this.addGridPositions(this.root);

            setTimeout(() => this.zoomable(), 10);
        },

        /**
         * Build pieces tree.
         *
         * @param  {Piece}  rootPiece
         * @param  {Array}  pieces
         * @param  {Number} parentId
         */
        buildPiecesTree(rootPiece, pieces, parentId) {
            for (let i = 0; i < pieces.length; i++) {
                let piece = pieces[i];

                if (piece.parent_id == parentId) {
                    pieces.splice(i--, 1);

                    let p = new Piece(piece.name, piece.vertical, piece.direction, piece.corner);

                    rootPiece.addChild(p);

                    this.buildPiecesTree(p, pieces, piece.id);
                }
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
