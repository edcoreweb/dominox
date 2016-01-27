import swal from 'sweetalert';

Vue.component('boneyard', {
    props: ['pieces', 'disable'],

    template: require('./../../templates/game/boneyard.html'),

    methods: {
        /**
         * Draw a piece.
         */
        draw() {
            if (this.disable) {
                return;
            }

            socket.send('game.piece.draw')
                .then((response) => this.$dispatch('game.piece.drawn', response.data))
                .catch(() => swal('Opps!', 'Something went wrong. Please try again.', 'error'));
        }
    }
});
