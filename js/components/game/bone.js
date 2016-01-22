import Piece from './../../Piece';

Vue.component('bone', {
    template: require('./../../templates/game/bone.html'),

    props: {
        piece: null
    },

    data() {
        return {
            parent: null,
            positionClasses: {},
            placeholderClasses: {},
            placeholders: [],
            hasPlaceholders: false
        };
    },

    created() {
        this.parent = this.getParent();
        this.positionClasses = this.getPositionClassObject();
    },

    methods: {
        select() {

            console.log(this.hasPlaceholders);

            if (!this.hasPlaceholders) {
                this.setPlaceholderClassObject();
            } else {
                this.clearPlaceholderClassObject();
            }
        },

        hasChildren() {
            return this.piece.hasChildren();
        },

        getChildren() {
            return this.piece.getChildren();
        },

        generatePlaceholders() {

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
         * Get the position of node relative to parent.
         * @return {Object} style object
         */
        getPlaceholderClassObject() {
            let style = {};

            style.placeholder = true;

            if (this.positionClasses['corner-down']) {
                style['placeholder-down'] = true;
            } else if (this.positionClasses['corner-up']) {
                style['placeholder-up'] = true;
            } else if (this.positionClasses['right']) {
                style['placeholder-down'] = true;
            } else if (this.positionClasses['left']) {
                style['placeholder-up'] = true;
            } else {
                style['placeholder-full'] = true;
            }

            return style;
        },

        /**
         * Sets the placeholder styling.
         */
        setPlaceholderClassObject() {
            this.placeholderClasses = this.getPlaceholderClassObject();
            this.hasPlaceholders = true;
        },

        /**
         * Clears the placeholder styling.
         */
        clearPlaceholderClassObject() {
            this.placeholderClasses = {};
            this.hasPlaceholders = false;
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


