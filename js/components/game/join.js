import swal from 'sweetalert';

module.exports = {
    template: require('./../../templates/game/join.html'),

    data() {
        return {
            game: null
        };
    },

    ready() {
        // Listen for user joining the game.
        socket.on('game.joined', (response) => {
            console.log('user hash joined', response.data);
        });

        // Listen for user leaving the game.
        socket.on('game.left', (response) => {
            console.log('user has left', response.data);
        });

        this.join();
    },

    methods: {
        /**
         * Join the game.
         */
        join() {
            socket.send('game.join', {hash: this.$route.params.hash})
                .then((response) => {
                    this.game = response.data;
                })
                .catch((response) => {
                    if (response.status == 404) {
                        swal({
                            type: 'error',
                            title: 'Error 404',
                            text: 'The game could not be found!',
                            confirmButtonText: 'Okay'
                        }, () => {
                            this.$router.go({name: 'game.browse'});
                        });
                    } else {
                        swal('Opps!', response.status == 422 ? response.data :
                            'Something went wrong. Please try again.', 'error');
                    }
                });
        },

        /**
         * Leave the game.
         */
        leave() {
            swal({
                type: 'warning',
                title: 'Are you sure?',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes, I\'m sure!'
            }, () => {
                socket.send('game.leave', {hash: this.$route.params.hash})
                    .then(() => this.$router.go({name: 'game.browse'}))
                    .catch(() => swal('Opps!', 'Something went wrong. Please try again.', 'error'));
            });
        }
    }
};
