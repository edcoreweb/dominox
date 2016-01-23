import swal from 'sweetalert';

module.exports = {
    template: require('./../../templates/game/join.html'),

    data() {
        return {

        };
    },

    methods: {
        leave() {
            this.confirm(() => {
                socket.send('game.leave', {hash: this.$route.params.hash})
                    .then(() => this.$router.go({name: 'game.browse'}))
                    .catch(() => swal('Opps!', 'Something went wrong. Please try again.', 'error'));
            });
        },

        confirm(callback) {
            swal({
                type: 'warning',
                title: 'Are you sure?',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes, I\'m sure!'
            }, callback);
        }
    }
};
