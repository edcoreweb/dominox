import Auth from './../../Auth';

module.exports = {
    template: require('./../../templates/game/main.html'),

    data() {
        return {
            selected: null,
        }
    },

    ready() {
    },

    methods: {

        select(event) {
            this.selected = event.target;
        },

        add(direction) {

        }
    }
};
