import Auth from './../../Auth';
import Piece from './../../Piece';

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
            this.selected = $(event.target).parent();
            let bone = new Piece();
            this.selected.append(bone.generateHTML());
            console.log(bone.generateHTML());
        },

        add(direction) {

        }
    }
};
