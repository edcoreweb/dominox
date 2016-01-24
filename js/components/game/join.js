import swal from 'sweetalert';

module.exports = {
    template: require('./../../templates/game/join.html'),

    data() {
        return {
            game: null
        };
    },

    ready() {
        // Listen for users joining the game.
        socket.on('game.joined', (response) => {
            this.game.users.push(response.data);
            this.game.joined += 1;

            if (this.isFull()) {
                this.redirect();
            }
        });

        // Listen for users leaving the game.
        socket.on('game.left', (response) => {
            let user = _.findWhere(this.game.users, {id: response.data.id});
            this.game.users.$remove(user);
            this.game.joined -= 1;
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

                    if (this.isFull()) {
                        this.redirect();
                    }
                })
                .catch(this.onError);
        },

        /**
         * Handle join game error.
         */
        onError(response) {
            let title = 'Opps!';
            let text = response.status == 422 ? response.data : 'Something went wrong. Please try again.';

            if (response.status == 404) {
                title = 'Error 404';
                text = 'The game could not be found!';
            }

            swal({
                type: 'error',
                title: title,
                text: text,
                confirmButtonText: 'Ok'
            }, () => {
                this.$router.go({name: 'game.browse'});
            });
        },

        /**
         * Determinte if the game is full.
         *
         * @return {Boolean}
         */
        isFull() {
            return this.game.joined == this.game.players;
        },

        /**
         * Redirect to play.
         */
        redirect() {
            this.$router.go({name: 'game.play', params: {hash: this.$route.params.hash}});
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
