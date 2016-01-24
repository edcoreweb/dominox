module.exports = {
    props: ['user'],

    template: require('./../../templates/game/browse.html'),

    data() {
        return {
            games: [],
            started: null
        };
    },

    ready() {
        // Fetch the open games.
        socket.send('game.browse')
            .then((response) => {
                this.games = response.data;
            });

        // Fetch started game.
        socket.send('game.started')
            .then((response) => {
                this.started = response.data;
            });

        // Listen for new games.
        socket.on('game.new', (response) => {
            this.games.unshift(response.data);
        });

        // Listen for game delete.
        socket.on('game.delete', (response) => {
            let game = _.findWhere(this.games, {id: response.data.id});
            this.games.$remove(game);
        });

        // Listen for game changes.
        socket.on('game.update', (response) => {
            let game = _.findWhere(this.games, {id: response.data.id});
            game.joined = response.data.joined;

            if (game.joined == game.players) {
                // this.games.$remove(game);
            }
        });
    },

    methods: {
        /**
         * Join a game.
         */
        join(game) {
            this.$router.go({'name': 'game.join', params: {hash: game.hash}});
        },

        /**
         * Resume the started game.
         */
        resumeStarted() {
            if (this.started.status === 'open') {
                this.$router.go({name: 'game.join', params: {hash: this.started.hash}});
            } else {
                this.$router.go({name: 'game', params: {hash: this.started.hash}});
            }
        },

        /**
         * Cancel teh started game.
         */
        cancelStarted() {
            this.started = null;
            socket.send('game.leave');
        }
    }
};
