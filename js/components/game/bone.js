import Piece from './../../Piece';
import {generatePlaceholders} from './util';

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
            hasPlaceholders: false
        };
    },

    created() {
        this.parent = this.getParent();
        this.positionClasses = this.getPositionClassObject();
        this.generateClasses();
    },

    ready() {
        if (this.piece.isPlaceholder) {
            this.droppable();
        }

        this.$on('placeholders.add', this.addPlaceholders);
        this.$on('placeholders.remove', this.removePlaceholders);
        this.$on('game.piece.add', this.addPiece);
    },

    methods: {
        addPlaceholders(piece) {
            if (this.piece.hasOpenEndSpots(piece.first) ||
                this.piece.hasOpenEndSpots(piece.second)) {
                let placeholders = generatePlaceholders(this.piece, this.getRoot().piece);
                this.piece.addChildren(placeholders);
            }

            this.$broadcast('placeholders.add', piece);
        },

        removePlaceholders() {
            this.piece.removePlaceholders();
            this.$broadcast('placeholders.remove');
        },

        addPiece(pieceData, parentData) {
            if (! parentData) {
                let piece = new Piece(pieceData.name);

                this.piece.name = piece.name;
                this.piece.first = piece.first;
                this.piece.second = piece.second;
                this.piece.isPlaceholder = false;

                this.positionClasses = this.getPositionClassObject();
                this.generateClasses();

                try {
                    $('.piece .piece-content').droppable('disable');
                } catch (e) {
                    //
                }
            } else if (parentData.name == this.piece.name) {
                let piece = new Piece(pieceData.name, pieceData.vertical,
                                    pieceData.direction, pieceData.corner);

                piece.calculateCoords(this.piece);

                this.piece.addChild(piece);
            }

            this.$broadcast('game.piece.add', pieceData, parentData);
        },

        /**
         * Make placeholder droppable.
         */
        droppable() {
            $(this.$el).find('.piece-content').droppable({
                activeClass: 'ui-state-highlight',
                accept: '.player-hand .player-piece',
                drop: this.onPieceDropped.bind(this)
            });
        },

        /**
         * Handle piece dropped.
         *
         * @param  {Object} e
         * @param  {Object} ui
         */
        onPieceDropped(e, ui) {
            let parent = this.getParentPiece();
            let selected = ui.helper.selectedPiece;

            if (!parent && selected.first != selected.second) {
                return;
            }

            this.piece.setValue(selected.first, selected.second);

            if (parent) {
                this.flip();
            }

            try {
                $('.piece .piece-content').droppable('disable');
            } catch (e) {
                //
            }

            this.piece.isPlaceholder = false;
            this.generateClasses();

            this.$dispatch('piece.dropped', selected, this.piece, parent);
        },

        /**
         * Flip current dropped piece if necessary.
         */
        flip() {
            let parent = this.getParentPiece();

            if (parent.vertical) {
                if (this.piece.shouldFlipValuesVertical(parent)) {
                    this.piece.setValue(this.piece.second, this.piece.first);
                }
            } else if (this.piece.shouldFlipValuesHorizontal(parent)) {
                this.piece.setValue(this.piece.second, this.piece.first);
            }
        },

        /**
         * Generate classes.
         */
        generateClasses() {
            if (this.piece.isPlaceholder) {
                this.clearBackgroundClassObject();
                this.setPlaceholderClassObject();
            } else {
                this.clearPlaceholderClassObject();
                this.setBackgroundClassObject();
            }
        },

        /**
         * Get the position of node relative to parent.
         *
         * @return {Object}
         */
        getPositionClassObject() {
            let style = {};

            style.vertical = this.piece.getVertical();
            style.horizontal = !this.piece.getVertical();

            if (this.parent) {
                style.counter = this.parent.positionClasses.vertical && !this.piece.getVertical();
                style.rotate = !this.parent.positionClasses.vertical && this.piece.getVertical();
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
         *
         * @return {Object}
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
         *
         * @return {Object}
         */
        getPlaceholderClassObject() {
            return { 'piece-placeholder': true };
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
            for (let name in this.contentClasses) {
                classObject[name] = this.contentClasses[name];
            }

            this.contentClasses = classObject;
        },

        /**
         * Removes properties from the content styling.
         */
        clearClassObject(classObject) {
            let newClassObject = this.contentClasses;

            for (let name in classObject) {
                if (newClassObject.hasOwnProperty(name)) {
                    delete newClassObject[name];
                }
            }

            this.contentClasses = {};
            this.contentClasses = newClassObject;
        },

        /**
         * Get the parent node.
         *
         * @return {Bone|null}
         */
        getParent() {
            return this.$parent.constructor.name == 'Bone' ? this.$parent : null;
        },

        /**
         * Get the parent node piece model.
         *
         * @return {Piece|null}
         */
        getParentPiece() {
            let parent = this.getParent();

            return parent ? parent.piece : null;
        },

        /**
         * Get the root of the tree.
         *
         * @return {Bone}
         */
        getRoot() {
            let rootNode = this.getParent();

            while (rootNode && rootNode.getParent()) {
                rootNode = rootNode.getParent();
            }

            return rootNode ? rootNode : this;
        }
    }
});
