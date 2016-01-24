import swal from 'sweetalert';

module.exports = {
    template: require('./../../templates/game/play.html'),

    data() {
        return {
            game: null
        };
    },

    ready() {
        socket.on('game.left', (response) => {
            let user = _.findWhere(this.game.users, {id: response.data.id});
            this.game.users.$remove(user);
            this.game.joined -= 1;
        });

        this.loadGame();
    },

    methods: {
        /**
         * Load the game.
         */
        loadGame() {
            socket.send('game.load', {hash: this.$route.params.hash})
                .then((response) => this.game = response.data)
                .catch(this.onError);
        },

        /**
         * Handle load game error.
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
        }
    }
};
