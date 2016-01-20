Vue.component('bone', {
    template: require('./../../templates/game/bone.html'),

    props: {
        model: Object
    },

    data() {
        return {
            parent: null,
            classes: {}
        };
    },

    created() {
        this.parent = this.$parent.constructor.name == 'Bone' ? this.$parent : null;

        this.classes = this.getClassObject();
    },

    computed: {
        hasChildren: function () {
            return this.model.children &&
                this.model.children.length;
        }
    },

    methods: {
        select() {
            console.log(this.model.name);
        },

        getClassObject() {
            let style = {};

            // if (this.parent) {

            //     this.switch = (this.parent.model.vertical != this.model.vertical);
            //     this.counter = (this.parent.model.vertical) ;

            //     style.switch = this.switch;
            //     style.counter = this.counter;

            // }

            // if (this.switch) {
            //     style.vertical = this.model.vertical;
            //     style.horizontal = !this.model.vertical;
            // }

            style.vertical = this.model.vertical;
            style.horizontal = !this.model.vertical;

            if (this.parent) {
                console.log(this.model.name, this.parent.classes.vertical, !this.model.vertical);
                style.counter = (this.parent.classes.vertical && !this.model.vertical);
                style.rotate = (!this.parent.classes.vertical && this.model.vertical);
            }

            style[this.model.direction] = true;

            return style;
        }
    }
});


