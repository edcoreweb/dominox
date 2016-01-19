// import Auth from './../../Auth';
// import Piece from './../../Piece';

Vue.component('bone', {
    template: require('./../../templates/game/bone.html'),

    props: {
        model: Object,
        parent: Object,
        grandparent: Object,
    },

    data: function () {
        return {
        };
    },

    computed: {
        hasChildren: function () {
            return this.model.children &&
                this.model.children.length;
        },

        classObject: function () {
            let style = {};

            this.switch = (this.parent.vertical != this.model.vertical);
            this.counter = (this.parent.vertical) ;

            style.switch = this.switch;
            style.counter = this.counter;

            if (this.switch) {
                style.vertical = this.model.vertical;
                style.horizontal = !this.model.vertical;
            }

            style[this.model.direction] = true;

            return style;
        }
    },

    methods: {
        select(event) {
            let selected = $(event.target).parent();
            console.log(this.model.name);
        },
    }
});


