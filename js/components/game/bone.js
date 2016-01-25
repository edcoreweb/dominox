import Piece from './../../Piece';
import Rectangle from './../../Rectangle';

Vue.component('bone', {
    template: require('./../../templates/game/bone.html'),

    props: {
        piece: null
    },

    data() {
        return {
            parent: null,
            positionClasses: {},
            contentClasses: {},
            placeholders: [],
            hasPlaceholders: false
        };
    },

    created() {
        this.parent = this.getParent();
        this.positionClasses = this.getPositionClassObject();
        this.generatePieceClasses();

        this.$on('placeholders.add', (piece) => {
            if (this.piece.hasOpenEndSpots(piece.first)) {
                this.placeholders = this.generatePlaceholders(this.piece);
                this.placeholders = this.getNonOvelappingPlaceholders(this.placeholders);
                this.piece.addChildren(this.placeholders);
            }

            if (this.piece.hasOpenEndSpots(piece.second)) {
                this.placeholders = this.generatePlaceholders(this.piece);
                this.placeholders = this.getNonOvelappingPlaceholders(this.placeholders);
                this.piece.addChildren(this.placeholders);
            }

            // setTimeout(() => {
            //     $(this.$el).children('.piece').each((i, el) => {
            //         let placeholders = $(el).children('.piece-placeholder');
            //         this.droppable(placeholders, piece);
            //     });
            // }, 100);

            this.$broadcast('placeholders.add', piece);
        });

        this.$on('placeholders.remove', () => {
            console.log('remove');
            this.$broadcast('placeholders.remove');
            this.piece.removePlaceholders();
        });
    },

    ready() {
        if (this.piece.isPlaceholder) {
            this.droppable();
        }
    },

    methods: {
        droppable() {
            $(this.$el).droppable({
                accept: '.player-hand > .player-piece',
                activeClass: 'ui-state-highlight',
                drop: (e, ui) => {
                    //if (this.piece.isParentFirstEndOpen()) {
                    this.piece.first = ui.helper.selectedPiece.first;
                    this.piece.second = ui.helper.selectedPiece.second;
                    // } else {
                    //     this.piece.second = ui.helper.selectedPiece.first;
                    //     this.piece.first = ui.helper.selectedPiece.second;
                    // }

                    this.piece.isPlaceholder = false;
                    this.generatePieceClasses();
                }
            });
        },

        generatePieceClasses() {
            if (this.piece.isPlaceholder) {
                this.clearBackgroundClassObject();
                this.setPlaceholderClassObject();
            } else {
                this.clearPlaceholderClassObject();
                this.setBackgroundClassObject();
            }
        },

        select() {
            // if (this.piece.hasOpenEndSpots(6)) {
            //     this.placeholders = this.generatePlaceholders(this.piece);
            //     this.placeholders = this.getNonOvelappingPlaceholders(this.placeholders);
            //     this.piece.addChildren(this.placeholders);
            // } else {
            //     console.log('can\'t add there');
            // }
        },

        hasChildren() {
            return this.piece.hasChildren();
        },

        getChildren() {
            return this.piece.getChildren();
        },

        /**
         * Calculate grid position relative to parent
         *
         * @param  {Piece} parent
         */
        generatePlaceholders(piece) {
            let pos = [];

            if (piece.vertical) {
                if (piece.direction == 'up') {
                    pos.push(
                        new Piece(null, true, 'up', null),
                        new Piece(null, false, 'left', 'up'),
                        new Piece(null, false, 'right', 'up')
                    );
                } else if (piece.direction == 'down') {
                    pos.push(
                        new Piece(null, true, 'down', null),
                        new Piece(null, false, 'left', 'down'),
                        new Piece(null, false, 'right', 'down')
                    );
                } else {
                    pos.push(
                        new Piece(null, true, 'up', null),
                        new Piece(null, true, 'down', null),
                        new Piece(null, false, piece.direction, null)
                    );
                }
            } else {
                if (piece.direction == 'left') {
                    pos.push(
                        new Piece(null, false, 'left', null),
                        new Piece(null, true, 'up', 'up'),
                        new Piece(null, true, 'down', 'up')
                    );
                } else if (piece.direction == 'right') {
                    pos.push(
                        new Piece(null, false, 'right', null),
                        new Piece(null, true, 'up', 'down'),
                        new Piece(null, true, 'down', 'down')
                    );
                } else if (piece.direction == 'root') {
                    pos.push(
                        new Piece(null, false, 'right', null),
                        new Piece(null, false, 'left', null)
                    );
                } else {
                    pos.push(
                        new Piece(null, false, 'left', null),
                        new Piece(null, false, 'right', null),
                        new Piece(null, true, piece.direction, null)
                    );
                }
            }

            for (let i = 0; i <pos.length; i++) {
                pos[i].calculateCoords(this.piece);
            }

            return pos;
        },

        getNonOvelappingPlaceholders(placeholders) {
            this.deleteOvelapps(placeholders, this.getRoot().piece);

            return placeholders;
        },

        deleteOvelapps(placeholders, piece) {
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
                this.deleteOvelapps(placeholders, children[i]);
            }
        },

        /**
         * Get the position of node relative to parent.
         * @return {Object} style object
         */
        getPositionClassObject() {
            let style = {};

            style.vertical = this.piece.getVertical();
            style.horizontal = !this.piece.getVertical();

            if (this.parent) {
                style.counter = (this.parent.positionClasses.vertical && !this.piece.getVertical());
                style.rotate = (!this.parent.positionClasses.vertical && this.piece.getVertical());
            } else if (this.piece.getVertical()) {
                style.rotate = true;
            }

            style[this.piece.getDirection()] = true;

            if (this.piece.getCorner()) {
                style['corner-' + this.piece.getCorner()] = true;
            }

            return style;
        },

        /**
         * Get the content background image.
         * @return {Object} style object
         */
        getBackgroundClassObject() {
            let style = {};

            let first = Math.max(this.piece.getFirst(), this.piece.getSecond());
            let second = Math.min(this.piece.getFirst(), this.piece.getSecond());

            style['piece-background'] = true;
            style['piece-' + first + '-' + second] = true;

            if (first > this.piece.getFirst()) {
                style.inverted = true;
            }

            return style;
        },

        /**
         * Sets background content styling.
         */
        setBackgroundClassObject() {
            this.setClassObject(this.getBackgroundClassObject());
        },

        /**
         * Clears the background content styling.
         */
        clearBackgroundClassObject() {
            this.clearClassObject(this.getBackgroundClassObject());
        },

        /**
         * Get the placeholder styling.
         * @return {Object} style object
         */
        getPlaceholderClassObject() {
            return {
                'piece-placeholder': true
            };
        },

        /**
         * Sets placeholder content styling.
         */
        setPlaceholderClassObject() {
            this.setClassObject(this.getPlaceholderClassObject());
            this.hasPlaceholders = true;
        },

        /**
         * Clears the placeholder content styling.
         */
        clearPlaceholderClassObject() {
            this.clearClassObject(this.getPlaceholderClassObject());
            this.hasPlaceholders = false;
        },

        /**
         * Adds properties to the content styling.
         */
        setClassObject(classObject) {
            for (let attrname in this.contentClasses) {
                classObject[attrname] = this.contentClasses[attrname];
            }

            this.contentClasses = classObject;
        },

        /**
         * Removes properties from the content styling.
         */
        clearClassObject(classObject) {
            let newClassObject = this.contentClasses;

            for (let attrname in classObject) {
                if (newClassObject.hasOwnProperty(attrname)) {
                    delete newClassObject[attrname];
                }
            }

            this.contentClasses = {};
            this.contentClasses = newClassObject;
        },

        /**
         * Check if parent node is Bone.
         * @return {Boolean}
         */
        isParentBone() {
            return this.$parent.constructor.name == 'Bone';
        },

        /**
         * Get the parent node.
         * @return {Bone | null}
         */
        getParent() {
            return this.isParentBone() ? this.$parent : null;
        },

        /**
         * Get the parent node piece model.
         * @return {Piece | null}
         */
        getParentPiece() {
            let parent = this.getParent();
            return parent ? parent.piece : null;
        },

        /**
         * Get the root of the table tree.
         * @return {Bone}
         */
        getRoot() {
            let rootNode = this.getParent();

            while(rootNode && rootNode.getParent()) {
                rootNode = rootNode.getParent();
            }

            return rootNode ? rootNode : this;
        }
    }
});


