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
            contentClasses: {},
            placeholders: [],
            hasPlaceholders: false
        };
    },

    created() {
        this.parent = this.getParent();
        this.positionClasses = this.getPositionClassObject();
        this.setBackgroundClassObject();
    },

    methods: {
        select() {

            console.log(this.hasPlaceholders, this.piece.name);

            if (!this.hasPlaceholders) {
                this.clearBackgroundClassObject();
                this.setPlaceholderClassObject();
            } else {
                this.clearPlaceholderClassObject();
                this.setBackgroundClassObject();
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


