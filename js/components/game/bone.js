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

        if (this.piece.isPlaceholder) {
            this.setPlaceholderClassObject();
        } else {
            this.setBackgroundClassObject();
        }
    },

    methods: {
        select() {

            if (this.piece.hasOpenEndSpots(3)) {
                this.placeholders = this.generatePlaceholders(this.piece);
                this.placeholders = this.getNonOvelappingPlaceholders(this.placeholders);

                this.piece.addChildren(this.placeholders);
            } else {
                console.log('can\'t add there');
            }

            // console.log(this.piece.getCoords());
            // console.log(this.piece.hasOpenEndSpots(3));
            // console.log(this.generatePlaceholders(this.piece));

            //console.log(this.hasPlaceholders, this.piece.name);

            // if (!this.hasPlaceholders) {
            //     this.clearBackgroundClassObject();
            //     this.setPlaceholderClassObject();
            // } else {
            //     this.clearPlaceholderClassObject();
            //     this.setBackgroundClassObject();
            // }
        },

        hasChildren() {
            return this.piece.hasChildren();
        },

        getChildren() {
            return this.piece.getChildren();
        },

        calculateOpenEnds(value) {

        },

        /**
         * Calculate grid position relative to parent
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

            for (var i = 0; i < placeholders.length; i++) {
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

            style.background = true;
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
            let style = {};

            style.placeholder = true;

            // if (this.positionClasses['corner-down']) {
            //     style['placeholder-down'] = true;
            // } else if (this.positionClasses['corner-up']) {
            //     style['placeholder-up'] = true;
            // } else if (this.positionClasses['right']) {
            //     style['placeholder-down'] = true;
            // } else if (this.positionClasses['left']) {
            //     style['placeholder-up'] = true;
            // } else {
                style['placeholder-full'] = true;
            // }

            return style;
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
        },
    }
});


