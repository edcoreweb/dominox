import Piece from './../../Piece';

module.exports = {
    template: require('./../../templates/game/replay.html'),

    data() {
        return {
            game: null,
            root: {},
            currentPlayer: null,
            index: 0,
            rounds: [],
        };
    },

    ready() {
        this.loadGame();
    },

    methods: {
        loadGame() {
            socket.send('game.replay', {hash: this.$route.params.hash})
                .then((response) => {
                    this.replay(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        replay(game) {
            this.game = game;

            let pieces = game.all_pieces;

            for (let round = 1; round < this.game.round; round++) {
                this.rounds.push( _.where(pieces, {round: round}) );
            }

            this.startCall();
        },

        startCall() {
            this.replayRound(this.replayCallback);
        },

        replayCallback() {
            this.root = null;

            this.index++;

            console.log(this.index);

            if (this.rounds[this.index]) {
                this.startCall();
            }
        },

        replayRound(callback) {
            let pieces = this.rounds[this.index];

            this.currentPlayer = pieces[0].user_id;

            this.root = new Piece(pieces[0].name, pieces[0].vertical, pieces[0].direction, pieces[0].corner);

            for (let i = 1; i < pieces.length; i++) {
                setTimeout(() => {
                    this.currentPlayer = pieces[i].user_id;
                    this.addPiece(this.root, pieces[i], this.getParent(pieces[i], pieces).name);

                    if (i == pieces.length - 1) {
                        callback();
                    }
                }, i * 500);
            }
        },

        addPiece(node, piece, parentName) {
            if (node.name == parentName || node.name == this.reverse(parentName)) {
                node.addChild(new Piece(piece.name, piece.vertical, piece.direction, piece.corner));
                return;
            }

            let children = node.getChildren();

            if (children.length) {
                for (let i = 0; i < children.length; i++) {
                    this.addPiece(children[i], piece, parentName);
                }
            }
        },

        getParent(piece, pieces) {
            return _.findWhere(pieces, {id: piece.parent_id});
        },

        reverse(s) {
            return s.split('').reverse().join('');
        }
    }
};
