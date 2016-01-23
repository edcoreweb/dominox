import swal from 'sweetalert';

module.exports = {
    props: ['user'],

    template: require('./../../templates/game/browse.html'),

    data() {
        return {
            games: []
        };
    },

    ready() {
        // Fetch the open games.
        socket.send('game.browse')
            .then((response) => {
                this.games = response.data;
            });

        // Listen for new games.
        socket.on('game.browse.new', (response) => {
            this.games.unshift(response.data);
        });

        // Listen for game delete.
        socket.on('game.browse.delete', (response) => {
            let index = _.findWhere(this.games, {id: response.data.id});
            this.games.$remove(index);
        });
    },

    methods: {
        /**
         * Join a game.
         */
        join(game) {
            socket.send('game.join', {hash: game.hash})
                .then(() => {
                    this.$router.go({'name': 'game.join', params: {hash: game.hash}});
                })
                .catch((response) => {
                    swal('Opps!', response.status == 422 ? response.data : 'Something went wrong. Please try again.', 'error');
                });
        }
    }
};
