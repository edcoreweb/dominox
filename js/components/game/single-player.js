import Piece from './../../Piece';
import {generatePlaceholders} from './util';

const USER = 1;
const BOT = 2;
const BOT_IMAGE = 'https://www.gravatar.com/avatar/0?d=mm&s=150';

module.exports = {
    template: require('./../../templates/game/single-player.html'),

    data() {
        return {
            game: null,
            root: null,
            currentPlayer: null,

            playerPieces: [],
            playerDisabled: true,

            boneyardDisabed: true,

            botPieces: [],

            boneyard: []
        };
    },

    ready() {
        // socket.on('game.left', this.userHasLeft);
        //this.$on('game.piece.added', this.pieceWasAdded);
        // socket.on('game.piece.drawn', this.userHasDrawnPiece);
        // socket.on('game.round.won', this.userHasWonRound);
        // socket.on('game.won', this.userHasWon);

        // this.$on('game.piece.drawn', this.pieceWasDrawn);

        this.$on('piece.dropped', (playerPiece, droppedPiece, parentPiece) => {
            this.playerPieces.$remove(playerPiece);

            this.currentPlayer = BOT;

            this.botMove();

            // this.$emit('game.piece.add', {
            //     piece: droppedPiece.serialize(),
            //     parent: parentPiece ? parentPiece.serialize() : null,
            //     user_id: this.currentPlayer
            // });

            // this.playerDisabled = true;
            // this.boneyardDisabed = true;
            // this.togglePlayerPieces();
        });

        this.generateGame();
    },

    computed: {
        opponents() {
            let players = [];

            for (let i in this.game.users) {
                if (this.game.users[i].id != USER) {
                    players.push(this.game.users[i]);
                }
            }

            return players;
        },

        playerActive() {
            return this.currentPlayer == USER;
        }
    },

    methods: {
        botMove() {
            let placeable = [];
            let botPieces = this.botPieces.slice(0);

            this.placeablePieaces(this.root, botPieces, placeable);

            if (placeable.length) {
                let placeholders = generatePlaceholders(placeable[0]._parent, this.root);

                placeable[0]._parent.addChildren(placeholders);

                console.log(placeholders);

                // let pieceData = {
                //     name:  placeable[0].name,
                //     first: placeable[0].first,
                //     second: placeable[0].second,
                //     vertical: placeable[0].vertical,
                //     direction: placeable[0].direction,
                //     corner: placeable[0].corner
                // };

                // let parentData = {name: placeable[0].parentName};

                // this.botPieces.$remove(placeable);

                // console.log(pieceData, parentData);

                // this.$broadcast('game.piece.add', pieceData, parentData);
            } else {
                console.log('else');
            }
        },

        generateGame() {
            this.boneyard = this.getDominoSet();

            let pieces = this.boneyard.splice(0, 6);

            for (let i = 0; i < pieces.length; i++) {
                this.botPieces.push(new Piece(pieces[i]));
            }

            pieces = this.boneyard.splice(0, 6);

            for (let i = 0; i < pieces.length; i++) {
                this.playerPieces.push(new Piece(pieces[i]));
            }

            this.game = {
                pieces: [],
                users: [{
                    id: USER,
                    points: 0,
                    pieces: this.playerPieces.length
                },
                {
                    id: BOT,
                    avatar: BOT_IMAGE,
                    points: 0,
                    pieces : this.botPieces.length
                }]
            };

            this.setCurrentPlayer(USER);

            this.setPieces(this.game.pieces);

            this.togglePlayerPieces();
        },

        pieceWasAdded(response) {
            this.setCurrentPlayer(this.currentPlayer == USER ? BOT : USER);

            if (response.user_id != USER) {
                this.$broadcast('game.piece.add', response.piece, response.parent);
            }

            this.togglePlayerPieces();

            let user = this.findUser(response.user_id);

            user.pieces -= 1;
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
                    playerPieces[i]._parent = piece;
                    placeable.push(playerPieces[i]);
                    playerPieces.splice(i, 1);
                    i--;
                }

                if (!playerPieces[i]) continue;

                if (piece.hasOpenEndSpots(playerPieces[i].first) || piece.hasOpenEndSpots(playerPieces[i].second)) {
                    playerPieces[i]._parent = piece;
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
                // this.root = new Piece(piece.name, piece.vertical, piece.direction, piece.corner);
                // this.buildPiecesTree(this.root, pieces, piece.id);
            } else {
                this.root = new Piece(null, false, 'root');
            }

            this.root.calculateCoords(null);
            this.addGridPositions(this.root);

            setTimeout(() => this.zoomable(), 10);
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
        },

        setCurrentPlayer(id) {
            this.currentPlayer = id;
            this.playerDisabled = id != USER;
        },

        getDominoSet() {
            let pieces = [];

            for (let i = 0; i <= 6; i++) {
                for (let j = 0; j <= i; j++) {
                    pieces.push(i +''+ j);
                }
            }

            return this.shuffle(pieces);
        },

        shuffle(o) {
            for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }
    }
};
